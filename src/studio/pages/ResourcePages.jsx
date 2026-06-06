import { useEffect, useMemo, useState } from "react"
import { Edit3, Plus, Save, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { CardContent, CardHeader, CardTitle, CloudinaryButton, ConfirmDialog, StudioCard, StudioHero, Toolbar } from "@/studio/components/StudioPrimitives"
import {
  useBlogs,
  useFranchiseFaqs,
  useFranchiseInquiries,
  useGallery,
  useLocations,
  useMenuDocuments,
  useMenuItems,
  useNavigationItems,
  usePages,
  useReservations,
  useSettings,
  useStudioMutation,
  useTestimonials,
} from "@/studio/hooks/useStudioQueries"

function asBool(value) {
  return value === true || value === "true"
}

function asNumber(value, fallback = 0) {
  const next = Number(value)
  return Number.isFinite(next) ? next : fallback
}

function isBlank(value) {
  return value === undefined || value === null || `${value}`.trim() === ""
}

function isFileValue(value) {
  return typeof File !== "undefined" && value instanceof File
}

function getImageSource(item = {}, field = {}) {
  const value = field.fileKey && isFileValue(item[field.fileKey])
    ? URL.createObjectURL(item[field.fileKey])
    : item.image_url || item[field.key] || item.external_image_url || item.image || item.cover_image || ""

  return typeof value === "string" ? value : ""
}

function ImagePreview({ src, alt = "Image preview", className = "" }) {
  if (!src) return null

  return (
    <div className={`studio-surface overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  )
}

function cleanPayload(payload, fields) {
  return fields.reduce((acc, field) => {
    let value = payload[field.key] ?? field.defaultValue
    if (field.type === "boolean") value = asBool(value)
    if (field.type === "number") value = asNumber(value, field.defaultValue || 0)
    if (field.type === "nullable-number") value = value === "" || value == null ? null : asNumber(value)
    if (field.type === "date" && !value) value = null
    if (field.type === "time" && !value) value = null
    if (field.type === "image" && field.fileKey && isFileValue(payload[field.fileKey])) value = ""
    acc[field.key] = value ?? ""
    if (field.fileKey && isFileValue(payload[field.fileKey])) acc[field.fileKey] = payload[field.fileKey]
    return acc
  }, {})
}

function validatePayload(payload, fields) {
  const errors = []

  fields.forEach((field) => {
    const value = payload[field.key] ?? field.defaultValue
    if (field.required && isBlank(value)) errors.push(`${field.label} is required`)
    if (field.type === "email" && !isBlank(value) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.push(`${field.label} must be a valid email`)
    }
    if ((field.type === "number" || field.type === "nullable-number") && !isBlank(value) && !Number.isFinite(Number(value))) {
      errors.push(`${field.label} must be a number`)
    }
    if (field.requireOneOf?.length && !field.requireOneOf.some((key) => !isBlank(payload[key]))) {
      errors.push(`${field.label} requires either an uploaded file or a URL`)
    }
  })

  return errors
}

function isPlainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
}

function cloneContent(value) {
  return JSON.parse(JSON.stringify(value || {}))
}

function setNestedValue(source, path, nextValue) {
  const root = Array.isArray(source) ? [...source] : { ...(source || {}) }
  let cursor = root

  path.forEach((part, index) => {
    if (index === path.length - 1) {
      cursor[part] = nextValue
      return
    }

    const current = cursor[part]
    cursor[part] = Array.isArray(current) ? [...current] : { ...(current || {}) }
    cursor = cursor[part]
  })

  return root
}

function titleizeKey(key) {
  return `${key || "value"}`
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function isLongTextField(key, value) {
  const lower = `${key || ""}`.toLowerCase()
  return (
    `${value || ""}`.length > 90 ||
    /(body|description|desc|excerpt|message|answer|lead|subtitle|privacy|disclaimer|quote|fallback|p\d+)/.test(lower)
  )
}

function isImageLikeField(key) {
  return /(image|img|photo|badge|background|logo|src)/i.test(`${key || ""}`)
}

function EditableScalar({ fieldKey, value, onChange }) {
  if (typeof value === "boolean") {
    return (
      <Select value={`${value}`} onValueChange={(next) => onChange(next === "true")}>
        <SelectTrigger className="studio-control h-11"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="true">true</SelectItem>
          <SelectItem value="false">false</SelectItem>
        </SelectContent>
      </Select>
    )
  }

  if (typeof value === "number") {
    return <Input className="studio-control h-11" type="number" value={value} onChange={(event) => onChange(asNumber(event.target.value, value))} />
  }

  if (isLongTextField(fieldKey, value)) {
    return <Textarea className="studio-control min-h-28" value={value || ""} onChange={(event) => onChange(event.target.value)} />
  }

  if (isImageLikeField(fieldKey)) {
    return (
      <div className="flex gap-2">
        <Input className="studio-control h-11" value={value || ""} onChange={(event) => onChange(event.target.value)} />
        <CloudinaryButton onUpload={(info) => onChange(info.secure_url)} />
      </div>
    )
  }

  return <Input className="studio-control h-11" value={value || ""} onChange={(event) => onChange(event.target.value)} />
}

function StructuredContentFields({ value, onChange, path = [] }) {
  if (Array.isArray(value)) {
    return (
      <div className="space-y-3">
        {value.map((item, index) => (
          <div key={index} className="studio-panel p-4">
            <div className="studio-label mb-3 text-[#21408e]/45">
              Item {index + 1}
            </div>
            {isPlainObject(item) || Array.isArray(item) ? (
              <StructuredContentFields value={item} path={[...path, index]} onChange={onChange} />
            ) : (
              <EditableScalar fieldKey={`${path.at(-1) || "item"}`} value={item} onChange={(next) => onChange([...path, index], next)} />
            )}
          </div>
        ))}
      </div>
    )
  }

  if (!isPlainObject(value)) {
    return <EditableScalar fieldKey={`${path.at(-1) || "value"}`} value={value} onChange={(next) => onChange(path, next)} />
  }

  return (
    <div className="grid gap-4">
      {Object.entries(value).map(([key, nestedValue]) => {
        const nextPath = [...path, key]
        const isNested = isPlainObject(nestedValue) || Array.isArray(nestedValue)

        return (
          <label key={nextPath.join(".")} className="grid gap-2 text-sm font-semibold text-[#21408e]">
            {titleizeKey(key)}
            {isNested ? (
              <div className="studio-surface p-4">
                <StructuredContentFields value={nestedValue} path={nextPath} onChange={onChange} />
              </div>
            ) : (
              <EditableScalar fieldKey={key} value={nestedValue} onChange={(next) => onChange(nextPath, next)} />
            )}
          </label>
        )
      })}
    </div>
  )
}

function EmptyState({ title = "Nothing here yet" }) {
  return <div className="studio-surface border-dashed p-10 text-center font-semibold text-[#21408e]/55">{title}</div>
}

function DataTable({ rows, columns, onEdit, onDelete, loading, hideDelete = false }) {
  if (loading) return <Skeleton className="h-72" />
  if (!rows.length) return <EmptyState />

  return (
    <div className="studio-surface overflow-hidden">
      <div className="studio-label hidden grid-cols-[1fr_1fr_1fr_120px] gap-4 border-b border-[#21408e]/10 px-5 py-3 text-[#21408e]/45 md:grid">
        {columns.map((column) => <span key={column.key}>{column.label}</span>)}
        <span>Actions</span>
      </div>
      {rows.map((row, index) => (
        <div key={row.id || row.slug || index} className="grid gap-3 border-b border-[#21408e]/8 p-4 last:border-0 md:grid-cols-[1fr_1fr_1fr_120px] md:items-center">
          {columns.map((column) => (
            <div key={column.key} className="min-w-0">
              <div className="studio-label mb-1 text-[0.68rem] text-[#21408e]/40 md:hidden">{column.label}</div>
              <div className="truncate text-sm font-semibold text-[#21408e]">{column.render ? column.render(row) : row[column.key] || "-"}</div>
            </div>
          ))}
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="studio-control" onClick={() => onEdit(row)} aria-label="Edit"><Edit3 className="size-4" /></Button>
            {!hideDelete && <Button variant="outline" size="icon" className="studio-control text-[#de1d3d]" onClick={() => onDelete(row)} aria-label="Delete"><Trash2 className="size-4" /></Button>}
          </div>
        </div>
      ))}
    </div>
  )
}

function ItemDialog({ open, onOpenChange, title, fields, item, onSave, saving }) {
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState([])
  const value = { ...(item || {}), ...form }

  useEffect(() => {
    if (!open) {
      setForm({})
      setErrors([])
    }
  }, [open])

  function update(key, next) {
    setForm((state) => ({ ...state, [key]: next }))
    setErrors([])
  }

  function save() {
    const payload = cleanPayload(value, fields)
    const nextErrors = validatePayload(value, fields)
    if (nextErrors.length) {
      setErrors(nextErrors)
      toast.error(nextErrors[0])
      return
    }
    onSave(payload)
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) { setForm({}); setErrors([]) }; onOpenChange(next) }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Save here and the CMS API becomes the source for the public site.</DialogDescription>
        </DialogHeader>
        {!!errors.length && (
          <div className="rounded-lg border border-[#de1d3d]/20 bg-[#de1d3d]/8 p-3 text-sm font-semibold text-[#9f1020]">
            {errors.map((error) => <div key={error}>{error}</div>)}
          </div>
        )}
        <div className="grid max-h-[62vh] gap-4 overflow-y-auto pr-1">
          {fields.map((field) => (
            <label key={field.key} className="grid gap-2 text-sm font-semibold text-[#21408e]">
              <span>{field.label}{field.required ? <span className="text-[#de1d3d]"> *</span> : null}</span>
              {field.type === "textarea" ? (
                <Textarea className="studio-control min-h-28" value={value[field.key] || ""} onChange={(event) => update(field.key, event.target.value)} />
              ) : field.type === "select" || field.type === "boolean" ? (
                <Select value={`${value[field.key] ?? field.defaultValue ?? field.options?.[0] ?? ""}`} onValueChange={(next) => update(field.key, next)}>
                  <SelectTrigger className="studio-control h-11 w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(field.options || ["true", "false"]).map((option) => {
                      const optionValue = typeof option === "object" ? option.value : option
                      const optionLabel = typeof option === "object" ? option.label : option
                      return <SelectItem key={optionValue} value={`${optionValue}`}>{`${optionLabel}`}</SelectItem>
                    })}
                  </SelectContent>
                </Select>
              ) : field.type === "image" ? (
                <div className="grid gap-2">
                  <ImagePreview
                    src={getImageSource(value, field)}
                    alt={value.alt_text || value.caption || value.title || field.label}
                    className="h-44 w-full"
                  />
                  <div className="flex gap-2">
                    <Input className="studio-control h-11" value={value[field.key] || ""} onChange={(event) => update(field.key, event.target.value)} placeholder="Paste image URL or public path" />
                    <CloudinaryButton onUpload={(info) => update(field.key, info.secure_url)} />
                  </div>
                  {(value.image_url || value[field.key] || value[field.fileKey]?.name) && (
                    <div className="studio-panel p-3 text-xs font-semibold text-[#21408e]/60">
                      {value[field.fileKey]?.name ? `Selected local file: ${value[field.fileKey].name}` : "Current image will be kept unless you choose a new file or paste a new URL."}
                    </div>
                  )}
                  {field.fileKey && (
                    <Input
                      className="studio-control h-11"
                      type="file"
                      accept="image/*"
                      onChange={(event) => update(field.fileKey, event.target.files?.[0] || null)}
                    />
                  )}
                </div>
              ) : (
                <Input className="studio-control h-11" type={field.type === "nullable-number" ? "number" : field.type || "text"} value={value[field.key] ?? ""} onChange={(event) => update(field.key, event.target.value)} />
              )}
            </label>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-[#de1d3d] text-white hover:bg-[#c51625]" disabled={saving} onClick={save}>
            <Save className="size-4" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CrudManager({ title, eyebrow, children, query, path, invalidate, fields, columns, searchKey = "title", addLabel = "Add", hideDelete = false }) {
  const [search, setSearch] = useState("")
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const { data = [], isLoading } = query
  const mutation = useStudioMutation({ path, invalidate, action: title.toLowerCase() })
  const rows = useMemo(() => data.filter((item) => `${item[searchKey] || item.title || item.name || item.label || ""}`.toLowerCase().includes(search.toLowerCase())), [data, search, searchKey])

  return (
    <div className="space-y-5">
      <StudioHero eyebrow={eyebrow} title={title}>{children}</StudioHero>
      <Toolbar search={search} onSearch={setSearch}>
        <Button className="h-11 rounded-lg bg-[#de1d3d] text-white" onClick={() => setEditing({})}><Plus className="size-4" />{addLabel}</Button>
      </Toolbar>
      <DataTable loading={isLoading} rows={rows} columns={columns} onEdit={setEditing} onDelete={setDeleting} hideDelete={hideDelete} />
      <ItemDialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)} title={title} item={editing} saving={mutation.isPending} fields={fields} onSave={(payload) => mutation.mutate({ id: editing?.id || editing?.slug, payload }, { onSuccess: () => setEditing(null) })} />
      <ConfirmDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)} onConfirm={() => mutation.mutate({ id: deleting?.id || deleting?.slug, method: "delete" }, { onSuccess: () => setDeleting(null) })} loading={mutation.isPending} />
    </div>
  )
}

export function MenuManagerPage() {
  const { data: documents = [] } = useMenuDocuments()
  const documentId = documents[0]?.id ? `${documents[0].id}` : ""
  const documentOptions = documents.map((document) => ({ value: document.id, label: document.title || document.slug || `Menu ${document.id}` }))
  const fields = [
    { key: "document", label: "Menu", type: "select", options: documentOptions, defaultValue: documentId, required: true },
    { key: "title", label: "Page title", required: true },
    { key: "description", label: "Description", type: "textarea" },
    { key: "external_image_url", label: "Image", type: "image", fileKey: "image", requireOneOf: ["external_image_url", "image", "image_url"] },
    { key: "alt_text", label: "Alt text", required: true },
    { key: "order", label: "Order", type: "number" },
    { key: "is_active", label: "Active", type: "boolean", defaultValue: "true" },
  ]
  return (
    <CrudManager
      title="Menu pages"
      eyebrow="Menu manager"
      query={useMenuItems({})}
      path="/v1/admin/menu/pages/"
      invalidate={["studio", "menu"]}
      fields={fields}
      columns={[
        { key: "image", label: "Image", render: (row) => getImageSource(row) ? <ImagePreview src={getImageSource(row)} alt={row.alt_text || row.title || "Menu page"} className="h-16 w-24" /> : "-" },
        { key: "title", label: "Title" },
        { key: "order", label: "Order" },
      ]}
    >
      Upload or reorder the image pages used by the public flipbook menu.
    </CrudManager>
  )
}

export function BlogsPage() {
  return (
    <CrudManager
      title="Blogs"
      eyebrow="Editorial"
      query={useBlogs({})}
      path="/v1/admin/blogs/"
      invalidate={["studio", "blogs"]}
      fields={[
        { key: "title", label: "Title", required: true },
        { key: "excerpt", label: "Excerpt", type: "textarea", required: true },
        { key: "content", label: "Content", type: "textarea", required: true },
        { key: "external_image_url", label: "Cover image", type: "image", fileKey: "cover_image", requireOneOf: ["external_image_url", "cover_image", "image_url"] },
        { key: "meta_title", label: "SEO title" },
        { key: "meta_description", label: "SEO description", type: "textarea" },
        { key: "status", label: "Status", type: "select", options: ["draft", "published"], defaultValue: "draft" },
        { key: "order", label: "Order", type: "number" },
      ]}
      columns={[
        { key: "title", label: "Title" },
        { key: "slug", label: "Slug" },
        { key: "status", label: "Status" },
      ]}
    >
      Create and publish stories for future website content without touching code.
    </CrudManager>
  )
}

export function GalleryManagerPage() {
  return (
    <CrudManager
      title="Gallery"
      eyebrow="Media library"
      query={useGallery()}
      path="/v1/admin/gallery/"
      invalidate={["studio", "gallery"]}
      fields={[
        { key: "external_image_url", label: "Image", type: "image", fileKey: "image", requireOneOf: ["external_image_url", "image", "image_url"] },
        { key: "caption", label: "Caption", required: true },
        { key: "alt_text", label: "Alt text", required: true },
        { key: "depth", label: "Parallax depth", type: "number", defaultValue: 1 },
        { key: "order", label: "Order", type: "number" },
        { key: "is_featured", label: "Featured on home", type: "boolean", defaultValue: "false" },
        { key: "is_active", label: "Active", type: "boolean", defaultValue: "true" },
      ]}
      columns={[
        { key: "image", label: "Image", render: (row) => getImageSource(row) ? <ImagePreview src={getImageSource(row)} alt={row.alt_text || row.caption || "Gallery image"} className="h-16 w-24" /> : "-" },
        { key: "caption", label: "Caption" },
        { key: "order", label: "Order" },
      ]}
      searchKey="caption"
    >
      Upload, caption, feature, and reorder gallery images shown on the public site.
    </CrudManager>
  )
}

export function ReservationsPage() {
  return (
    <CrudManager
      title="Reservations"
      eyebrow="Guest flow"
      query={useReservations({})}
      path="/v1/admin/reservations/"
      invalidate={["studio", "reservations"]}
      fields={[
        { key: "name", label: "Guest name", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "phone", label: "Phone", required: true },
        { key: "date", label: "Date", type: "date", required: true },
        { key: "time", label: "Time", type: "time", required: true },
        { key: "guests", label: "Guests", type: "number", defaultValue: 2 },
        { key: "message", label: "Message", type: "textarea" },
        { key: "status", label: "Status", type: "select", options: ["pending", "confirmed", "completed", "cancelled"], defaultValue: "pending" },
      ]}
      columns={[
        { key: "name", label: "Guest" },
        { key: "date", label: "Date" },
        { key: "status", label: "Status" },
      ]}
      searchKey="name"
    >
      Manage booking requests and manually add phone or walk-in reservations.
    </CrudManager>
  )
}

export function NavigationPage() {
  return (
    <CrudManager
      title="Navigation"
      eyebrow="Header links"
      query={useNavigationItems()}
      path="/v1/admin/navigation/"
      invalidate={["studio", "navigation"]}
      fields={[
        { key: "label", label: "Label", required: true },
        { key: "url", label: "URL", required: true },
        { key: "order", label: "Order", type: "number" },
        { key: "is_active", label: "Active", type: "boolean", defaultValue: "true" },
        { key: "open_in_new_tab", label: "Open in new tab", type: "boolean", defaultValue: "false" },
      ]}
      columns={[
        { key: "label", label: "Label" },
        { key: "url", label: "URL" },
        { key: "order", label: "Order" },
      ]}
      searchKey="label"
    >
      Edit the navbar links consumed by the public header and mobile menu.
    </CrudManager>
  )
}

function SectionEditor({ section, mutation }) {
  const [contentEn, setContentEn] = useState(() => cloneContent(section.content_en || section.content))

  function updateEnglish(path, value) {
    setContentEn((state) => setNestedValue(state, path, value))
  }

  function save() {
    mutation.mutate({
      id: section.id,
      payload: {
        content: contentEn,
        content_en: contentEn,
        content_de: contentEn,
        is_active: section.is_active,
        order: section.order,
        section_key: section.section_key,
        section_type: section.section_type,
      },
    })
  }

  return (
    <StudioCard>
      <CardHeader>
        <CardTitle>{titleizeKey(section.section_key)}</CardTitle>
        <p className="studio-label text-[#21408e]/45">{section.section_type}</p>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="studio-panel p-4">
          <div className="studio-label mb-4 text-[#21408e]/55">Content</div>
          <StructuredContentFields value={contentEn} onChange={updateEnglish} />
        </div>
        <Button className="h-11 rounded-lg bg-[#de1d3d] text-white" onClick={save} disabled={mutation.isPending}><Save className="size-4" />Save section</Button>
      </CardContent>
    </StudioCard>
  )
}

export function PagesEditorPage() {
  const { data = [], isLoading } = usePages()
  const [activeSlug, setActiveSlug] = useState("home")
  const [activeSectionKey, setActiveSectionKey] = useState("")
  const mutation = useStudioMutation({ path: "/v1/admin/cms/sections/", invalidate: ["studio", "pages"], action: "section save" })
  const activePage = data.find((page) => page.slug === activeSlug) || data[0]
  const sections = activePage?.sections || []
  const activeSection = sections.find((section) => section.section_key === activeSectionKey) || sections[0]

  useEffect(() => {
    if (!activePage && data.length) setActiveSlug(data[0].slug)
  }, [activePage, data])

  return (
    <div className="space-y-5">
      <StudioHero eyebrow="Dynamic page content" title="Live section editor">Edit every text, link, image URL, card, and list item for CMS-backed public page sections.</StudioHero>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading ? <Skeleton className="h-44" /> : data.map((page) => (
          <StudioCard
            key={page.slug}
            className={`cursor-pointer transition hover:-translate-y-1 ${activePage?.slug === page.slug ? "ring-2 ring-[#de1d3d]" : ""}`}
            onClick={() => {
              setActiveSlug(page.slug)
              setActiveSectionKey(page.sections?.[0]?.section_key || "")
            }}
          >
            <CardHeader><CardTitle>{page.title}</CardTitle></CardHeader>
            <CardContent><p className="studio-muted">{page.sections?.length || 0} editable sections</p></CardContent>
          </StudioCard>
        ))}
      </div>

      {activePage && (
        <div className="grid gap-5 xl:grid-cols-[280px_1fr]">
          <StudioCard>
            <CardHeader>
              <CardTitle>{activePage.title}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection?.id === section.id ? "default" : "outline"}
                  className={`h-auto justify-start rounded-lg px-4 py-3 text-left ${activeSection?.id === section.id ? "bg-[#de1d3d] text-white hover:bg-[#c51625]" : "studio-control text-[#21408e]"}`}
                  onClick={() => setActiveSectionKey(section.section_key)}
                >
                  <span>
                    <span className="block font-bold">{titleizeKey(section.section_key)}</span>
                    <span className="block text-xs opacity-70">{section.section_type}</span>
                  </span>
                </Button>
              ))}
            </CardContent>
          </StudioCard>
          <div>
            {activeSection ? (
              <SectionEditor key={activeSection.id} section={activeSection} mutation={mutation} />
            ) : (
              <EmptyState title="No editable sections found for this page" />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function SettingsPage() {
  const { data, isLoading } = useSettings()
  const franchiseFaqsQuery = useFranchiseFaqs()
  const locationsQuery = useLocations()
  const testimonialsQuery = useTestimonials()
  const franchiseInquiriesQuery = useFranchiseInquiries()
  const [form, setForm] = useState({})
  const mutation = useStudioMutation({ path: "/v1/admin/settings/", invalidate: ["studio", "settings"], action: "settings save" })
  const value = { ...(data || {}), ...form }
  const fields = ["site_name", "phone", "phone_display", "email", "city", "address", "opening_hours", "facebook_url", "instagram_url", "youtube_url", "order_url", "privacy_url", "terms_url", "footer_text"]
  const requiredSettings = ["site_name", "phone", "phone_display", "email", "address"]

  function saveSettings() {
    const missing = requiredSettings.filter((key) => isBlank(value[key]))
    if (missing.length) {
      toast.error(`${titleizeKey(missing[0])} is required`)
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email || "")) {
      toast.error("Email must be a valid email")
      return
    }
    const payload = fields.reduce((acc, key) => ({ ...acc, [key]: value[key] || "" }), {})
    mutation.mutate({ id: data?.id || 1, payload }, { onSuccess: () => setForm({}) })
  }

  return (
    <div className="space-y-5">
      <StudioHero eyebrow="Settings" title="Brand controls">Contact details, footer content, socials, logo, and global operational links.</StudioHero>
      {isLoading ? <Skeleton className="h-80" /> : (
        <StudioCard>
          <CardContent className="grid gap-4 p-5 md:grid-cols-2">
            {fields.map((key) => (
              <label key={key} className="studio-label grid gap-2 text-[#21408e]/70">
                {key.replace(/_/g, " ")}{requiredSettings.includes(key) ? <span className="text-[#de1d3d]"> *</span> : null}
                {key === "address" || key === "footer_text" ? (
                  <Textarea className="studio-control min-h-28 normal-case" value={value[key] || ""} onChange={(event) => setForm((state) => ({ ...state, [key]: event.target.value }))} />
                ) : (
                  <Input className="studio-control h-11 normal-case" value={value[key] || ""} onChange={(event) => setForm((state) => ({ ...state, [key]: event.target.value }))} />
                )}
              </label>
            ))}
            <Button className="h-11 rounded-lg bg-[#de1d3d] text-white md:col-span-2" disabled={mutation.isPending} onClick={saveSettings}>
              <Save className="size-4" />
              {mutation.isPending ? "Saving..." : "Save settings"}
            </Button>
          </CardContent>
        </StudioCard>
      )}
      <div className="grid gap-5 xl:grid-cols-2">
        <CrudManager title="Franchise FAQs" eyebrow="Franchise" query={franchiseFaqsQuery} path="/v1/admin/franchise/faq/" invalidate={["studio", "franchiseFaqs"]} fields={[{ key: "question", label: "Question", required: true }, { key: "answer", label: "Answer", type: "textarea", required: true }, { key: "order", label: "Order", type: "number" }, { key: "is_active", label: "Active", type: "boolean", defaultValue: "true" }]} columns={[{ key: "question", label: "Question" }, { key: "order", label: "Order" }, { key: "is_active", label: "Active", render: (row) => row.is_active ? "Yes" : "No" }]} searchKey="question">Edit the FAQ records used by the public franchise page.</CrudManager>
        <CrudManager title="Locations" eyebrow="Branches" query={locationsQuery} path="/v1/admin/locations/locations/" invalidate={["studio", "locations"]} fields={[{ key: "name", label: "Name", required: true }, { key: "slug", label: "Slug", required: true }, { key: "address", label: "Address", type: "textarea", required: true }, { key: "city", label: "City", required: true }, { key: "country", label: "Country", required: true }, { key: "phone", label: "Phone" }, { key: "email", label: "Email", type: "email" }, { key: "google_maps_url", label: "Google maps URL" }, { key: "is_active", label: "Active", type: "boolean", defaultValue: "true" }]} columns={[{ key: "name", label: "Name" }, { key: "city", label: "City" }, { key: "is_active", label: "Active", render: (row) => row.is_active ? "Yes" : "No" }]} searchKey="name">Maintain branch information for CMS APIs.</CrudManager>
        <CrudManager title="Testimonials" eyebrow="Reviews" query={testimonialsQuery} path="/v1/admin/testimonials/" invalidate={["studio", "testimonials"]} fields={[{ key: "name", label: "Name", required: true }, { key: "role", label: "Role" }, { key: "content", label: "Content", type: "textarea", required: true }, { key: "rating", label: "Rating", type: "number", defaultValue: 5 }, { key: "order", label: "Order", type: "number" }, { key: "is_active", label: "Active", type: "boolean", defaultValue: "true" }]} columns={[{ key: "name", label: "Name" }, { key: "rating", label: "Rating" }, { key: "is_active", label: "Active", render: (row) => row.is_active ? "Yes" : "No" }]} searchKey="name">Control testimonial records exposed through the public API.</CrudManager>
        <CrudManager title="Franchise inquiries" eyebrow="Leads" query={franchiseInquiriesQuery} path="/v1/admin/franchise/inquiries/" invalidate={["studio", "franchiseInquiries"]} fields={[{ key: "name", label: "Name", required: true }, { key: "email", label: "Email", type: "email", required: true }, { key: "phone", label: "Phone" }, { key: "city", label: "City" }, { key: "country", label: "Country" }, { key: "message", label: "Message", type: "textarea" }, { key: "is_reviewed", label: "Reviewed", type: "boolean", defaultValue: "false" }]} columns={[{ key: "name", label: "Name" }, { key: "city", label: "City" }, { key: "is_reviewed", label: "Reviewed", render: (row) => row.is_reviewed ? "Yes" : "No" }]} searchKey="name" hideDelete>Review franchise leads submitted from the public site.</CrudManager>
      </div>
    </div>
  )
}
