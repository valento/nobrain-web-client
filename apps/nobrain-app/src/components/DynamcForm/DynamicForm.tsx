import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import staticDataSchema from '@/assets/read.data.json' with { type: 'json' }
import readUiSchema from '@/assets/read.ui.json'
import appUiSchema from '@/assets/app.ui.json'
import { broker, storage } from '@nx-mono/broker'
import type { Category, ContentWithSchemas } from '@/types/content';
import { useParams } from 'react-router-dom'
import { PollsOptionsWidget, type PollOption } from '../ui/polls-options.widget'

interface AppRegistryEntry {
  "id": number
  "package_name": string
  "component_name": string
  "route_path": string
}

type UIElement = {
  field: string
  widget: string
  placeholder?: string
  rows?: number
  min?: number
  max?: number
  edit?: boolean
  view?: boolean
  condition?: {
    field: string
    component?: string
    value?: string
    also?: { field: string; value: string }
  }
}

/**
 * 
 * Renders full content pages
 * in READ or EDIT or CREATE modes.
 * 
 * CREATE takes /create/{app | read} mode from URL and
 * renders empty Form given the uiSchema/dataSchema for field-types
 * and default data
 * 
 * EDIT takes content_id from URL and renders Form
 * given uiSchema for field-types and data from DB and dataSchema
 * 
 * READ renders just a page with content_id data
 * 
 */


export default function DynamicForm (
    {
      data,
      mode='edit',
      onSaveSuccess
    }: {
      data?: ContentWithSchemas;
      mode: 'edit' | 'read' | 'view';
      onSaveSuccess: ()=> void
    }
  ) {

  const API_URL = import.meta.env.VITE_API_NET || 'http://localhost:8000'
  const {content_type} = useParams() || 'read'
  const {content_id} = useParams() || null

  const [content, setContent] = useState<ContentWithSchemas | null>(null)
  const [formData, setFormData] = useState<Record<string, string | number | string[] | PollOption[] | null>>({})
  const [categories, setCategories] = useState<Category[]>([])
  const [registeredApps, setRegisteredApps] = useState<AppRegistryEntry[]>([])
  
  const dataSchema = staticDataSchema
  const uiSchema = content_type === 'read' || content_id ? readUiSchema : appUiSchema
  
  // content_id update state
  useEffect(() => {
    if (data) {
      setContent(data)
      setFormData({
        title: data.title,
        deck: data.deck,
        body: data.body,
        created_at: data.created_at,
        widget_size: data.widget_size,
        price: data.price,
        updated_at: new Date(data.updated_at).toLocaleDateString('en-US',
          {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
        author: data.author_username,
        slug: data.slug,
        category_id: data.category_id ?? '',
        ...data.metadata
      })
    }
  }, [data?.id])

  // next-chapter update state
  useEffect(() => {
    const handleNext = () => {
      if(data) {
        const { id, widget_size, parent_id } = data
        setFormData({
          title: '',
          deck: '',
          body: '',
          subcategory: '',
          parent_id: parent_id? parent_id: id,
          widget_size,
          ...data.metadata
        })
    }
    setContent(null)
  }
    broker.on('ui:next-chapter', handleNext)

    return () => broker.off('ui:next-chapter', handleNext)
  }, [formData.id])

  useEffect(() => {
    const refreshForm = () => {
      if(data) {
        setFormData({
        title: data.title,
        deck: data.deck,
        body: data.body,
        created_at: data.created_at,
        widget_size: data.widget_size,
        price: data.price,
        updated_at: new Date(data.updated_at).toLocaleDateString('en-US',
          {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          author: data.author_username,
          slug: data.slug,
        ...data.metadata
      })
      }
    }
    broker.on('ui:cancel-edit', refreshForm)

    return () => broker.off('ui:cancel-edit', refreshForm)
  }, [mode])

  // fetch categories on mount
  useEffect(() => {
    fetch(`${API_URL}/categories/`)
      .then(r => r.json())
      .then(setCategories)
  }, [])

  // fetch registered apps on mount
  useEffect(() => {
    fetch(`${API_URL}/apps/registry`).then(r => r.json()).then(setRegisteredApps)
  }, [])


// ------ HELPERS ------------------------------
// Nested JSONB DB-objects (like metadata)
  function getNestedValue(obj: Record<string, string | number | string[] | PollOption[] | null>, path: string): string | number | string[] | undefined {    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = path.split('.').reduce((acc: any, part) => acc?.[part], obj)
    return value as string | number | string[] | undefined
  }

// ui-schema field-conditions
  const shouldRender = (element: UIElement): boolean => {    
    if (!element.condition) return true

    const { field, component, also } = element.condition
    console.log( 'Should render?: ' , also?.value)


    if (component) {
      const selectedApp = registeredApps.find(a => a.id === formData[field])
      if (selectedApp?.component_name !== component) return false
    }

    if (also && formData[also.field] !== also?.value) return false
    return true
  }

//** ==========================================================================
// This Renders UI-elements:
// 1. traverse *.ui.schema.json
// 2. render JSX for each widget-key: "widget": "select" (input/option...)
// ========================================================================== */
  function renderField(element: { field: string; widget: string;
      placeholder?: string;
      rows?: number;
      min?: number;
      max?: number;
      edit?: boolean;
      view?: boolean;
      options?: string[]
    }) {
    if(!content && mode == 'read') return null

    const fieldSchema = (dataSchema.properties as Record<string, any>)[element.field]
    const value = getNestedValue(formData, element.field)// formData[element.field] || ''    

    if (mode === 'read') {
      switch (element.widget) {
        case 'input':
          return <div className={element.field}>
            { (element.field === 'author_username' && !value) ? 'Anonymous' : value }
          </div>
        case 'textarea':
          return <div className={element.field}>
            { element.field === 'body' ? 
            <ReactMarkdown
              components={{
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
                )
              }}
              remarkPlugins={[remarkGfm]}
            >
              {value?.toString()}
            </ReactMarkdown>: value }
          </div>
        case 'select':
          return null
        
        case 'slider':
          return null
        case 'tag-input':
          {
            const readTags: string[] = Array.isArray(value) ? value : []
            return readTags.length ? (
              <div className="tag-list">
                {readTags.map((tag, i) => <div key={i} className="tag-chip">{tag}</div>)}
              </div>
            ) : null
          }
        case 'toggle':
          return null
        default:
          return <div className={element.field}>{value}</div>
      }
   }
    
    switch (element.widget) {
      case 'input':
        return (
          (!element.edit || !element.view) ? <></>: 
          <input
            type="text"
            id={`form-${element.field}`}
            value={value}
            className={element.field}
            placeholder={element.placeholder}
            onChange={e => handleChange(element.field, e.target.value)}
          />
        )
      case 'select':
        {
          if (element.field === 'category_id') {
            return (
              <select
                value={formData.category_id as number || ''}
                onChange={e => handleChange('category_id', Number(e.target.value))}
              >
                <option>-- category --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            )
          }

          const selectValue = value as string || ''
          const options = element.options ?? fieldSchema?.enum  // ← uiSchema first, dataSchema fallback
          
          return (
            <select id={selectValue} 
              className={''}
              value={selectValue}
              onChange={e => handleChange(element.field, e.target.value)}
            >
              <option>-- {element.field.replace('_',' ')} --</option>
              {options.map((opt: string) => 
                <option key={opt} value={opt} >{opt}</option>
              )}
            </select>
        )}
      case 'app-select':
        return (
          <select
            value={formData.app_id as number || ''}
            onChange={e => handleChange('app_id', Number(e.target.value))}
          >
            <option value=''>-- select app --</option>
            {registeredApps.map(app => (
              <option key={app.id} value={app.id}>{app.component_name}</option>
            ))}
          </select>
        )
      case 'polls-options':
        return (
          <PollsOptionsWidget
            value = {formData[element.field] || []}
            onChange={val => handleChange(element.field, val)}
          />
        )
      case 'toggle':
        return (
          <>
            <span>{element.field.replace('_', ' ')}</span>
            <input type="checkbox" />
          </>
        )
      case 'slider':
        return (
          element.view ?
          <div className='slider'>
            <label>priority:</label>
            <input
              type="range"
              min={element.min || fieldSchema?.minimum || 1}
              max={element.max || fieldSchema?.maximum || 10}
              value={formData[element.field] || element.min || 1}
              onChange={e => handleChange(element.field, Number(e.target.value))}
            />
            <span>{formData[element.field] || element.min || 1}</span>
          </div>
          : <></>
        )
      case 'tag-input':
        {
          const tags: string[] = Array.isArray(value) 
            ? value 
            : typeof value === 'string' && value 
              ? [value] 
              : []
          return (
            <div className={element.field}>
              <div className='tag-list'>
                {tags.map((tag, i) => (
                  <span key={i} className='tag-chip'>
                    
                    <button type="button" onClick={() =>
                      handleChange(element.field, tags.filter((_, idx) => idx !== i))
                    }>{tag} ×</button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                className='tags'
                placeholder={element.placeholder}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const input = e.target as HTMLInputElement
                    const val = input.value.trim()
                    if (val && !tags.includes(val)) {
                      handleChange(element.field, [...tags, val])
                      input.value = ''
                    }
                  }
                }}
              />
            </div>
        )}
      case 'textarea':
        return (
          <textarea
            value={value} 
            rows={element.rows || 4}
            placeholder={element.placeholder}
            onChange={e => handleChange(element.field, e.target.value)}
          />
        )
      case 'datetime':
        return (
          <input
            type="datetime-local"
            id={`form-${element.field}`}
            value={value || ''}
            onChange={e => handleChange(element.field, e.target.value)}
          />
        )
      default:
        return <p className='hideme'>Unknown widget: {element.field}</p>
    }
  }

// ========================================================================
// Handlers: Change, Submit
// ========================================================================

  function handleChange(field: string, value: string | string[] | number) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    
    // Apps Data POST
    const selectedApp = registeredApps.find(a => a.id === formData.app_id)
    const isPollsApp = selectedApp?.component_name === 'PollsApp'

    // Restructure formData to match API expectation
    const payload = isPollsApp? {
      title: formData.title,
      // slug: formData.slug,
      deck: formData.deck,
      app_id: formData.app_id,
      widget_size: formData.widget_size || 'medium',
      interaction_mode: formData.interaction_mode || 'social',
      allow_multiple_shares: formData.allow_multiple_shares || false,
      question: formData.question,
      poll_type: formData.poll_type,
      options: formData.options || [],
      closes_at: formData.closes_at || null,
      category_id: formData.category_id || null,
      status: formData.status || 'draft',
    }:{
      title: formData.title as string,
      deck: formData.deck as string,
      slug: formData.slug as string,
      body: formData.body as string,
      category_id: formData.category_id as number || null,  // added
      metadata: {
        content_type: content_type,
        component_name: formData.component_name,
        subcategory: formData.subcategory || null,
        tags: formData.tags,
        priority: formData.priority,
        status: formData.status,
        seo_keywords: formData.seo_keywords
      },
      widget_size: formData.widget_size || 'medium',
      widget_vertical: formData.widget_vertical || false,
      parent_id: formData.parent_id,
      author_id: storage.getUser()?.id as number || 1,
    }
    
    let REQUEST_URL = content_type === 'read' ? `${API_URL}/content/${content?.id}` : `${API_URL}/content/`
    REQUEST_URL = content?.slug ? `${API_URL}/content/${content?.id}` : `${API_URL}/content/`
    let REQUEST_METOD = content?.id? 'PUT' : 'POST'
    if(isPollsApp) {
      REQUEST_URL = `${API_URL}/polls/`
      REQUEST_METOD = 'POST'
    }
    
    try {
      const token = storage.getToken()
      const response = await fetch(REQUEST_URL, {
        method: REQUEST_METOD,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        const content = await response.json()
        setContent(content)
        onSaveSuccess()
      }
    } catch (error) {
      console.error('Failed to create content:', error)
    }
  }
  
// ==============================================================
// Render Content
if(content_type && !['app','read'].includes(content_type)) return <>Wrong URL...</>

  return mode == 'edit' ? (
    <form className='json-form'
      onSubmit={async (e) => {
        e.preventDefault()
        handleSubmit(e)
      }}>
      {uiSchema.elements.map(el => (
        (shouldRender(el)) &&
        (
          <div className={['select','toggle','app-select','datetime'].includes(el.widget) ? 'select-box' : ''} key={el.field} >
            {/* <label>{el.field}</label> */}
            {renderField(el)}
          </div>
        )
      ))}
      <div className='full-line'>
        <button className='submit' type="submit">Save</button>
      </div>
      {mode === 'edit' && formData && data?.id && formData.parent_id != null && (
        <button
          className='submit secondary'
          type="button"
          // onClick={() => navigate.(`/admin/new?parent_id=${formData.id}`)}
        >
          Add Chapter
        </button>
      )}
    </form>
  ) : (
    <article className={data?.category_slug || ''}>
      <div>
      {
        uiSchema.elements.map(el => <div key={el.field}>{renderField(el)}</div>)
      }
      <div className='social'>social tools</div>
      </div>
    </article>
  )
}