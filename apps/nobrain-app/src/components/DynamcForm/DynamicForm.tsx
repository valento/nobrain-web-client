import { useEffect, useState } from 'react'

import staticDataSchema from '@/assets/read.data.json' with { type: 'json' }
import staticUiSchema from '@/assets/read.ui.json'

interface SchemaProperty {
  type: string
  maxLength?: number
  minimum?: number
  maximum?: number
  enum?: string[]
  items?: {
    type: string
  }
  const?: string
  properties?: Record<string, SchemaProperty>
}

interface ContentWithSchemas {
  id: number
  title: string
  deck: string
  body: string
  slug: string
  author_name: string
  metadata: Record<string, SchemaProperty>
  created_at: string
  updated_at: string
}

function DynamicForm({contentId, mode='edit'}: {contentId?: number; mode: 'edit' | 'read'}) {
  const [content, setContent] = useState<ContentWithSchemas | null>(null)
  const [formData, setFormData] = useState<Record<string, string | number | string[]>>({})
// console.log(formData);

  const dataSchema = staticDataSchema
  const uiSchema = staticUiSchema

  const [loading, setLoading] = useState(mode == 'read'? true : false)

  useEffect(() => {
    if (!contentId) return
    setLoading(true)
    
    fetch(`http://localhost:8000/content/${contentId}`)
      .then(result => result.json())
      .then((data: ContentWithSchemas) => {
        setContent(data)
        
        setFormData({
          title: data.title,
          deck: data.deck,
          body: data.body,
          created_at: data.created_at,
          updated_at: new Date(data.updated_at).toLocaleDateString('en-US',
            {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            author: data.author_name,
            slug: data.slug,
          ...data.metadata
        })
        setLoading(false)
      })
      .catch( err => {
        console.log('Faild to load data', err);
        setLoading(false)
      })
    
  } ,[contentId])
  

  function handleChange(field: string, value: string | string[] | number) {
    console.log(field, value);
    
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
// Nested JSONB DB-objects (like metadata)
  function getNestedValue(obj: Record<string, string | number | string[]>, path: string): string | number | string[] | undefined {    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = path.split('.').reduce((acc: any, part) => acc?.[part], obj)
    return value as string | number | string[] | undefined
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    
    // Restructure formData to match API expectation
    const payload = {
      title: formData.title as string,
      deck: formData.deck as string,
      slug: formData.slug as string,
      body: formData.body as string,
      metadata: {
        content_type: 'read',
        read_category: formData.read_category,
        subcategory: formData.subcategory,
        tags: formData.tags,
        priority: formData.priority || 5,
        status: formData.status,
        seo_keywords: formData.seo_keywords
      },
      author_id: formData.author_id as number || 1
    }

    try {
      const REQUEST_URL = contentId? `http://localhost:8000/content/${contentId}` : 'http://localhost:8000/content/'
      const REQUEST_METOD = contentId? 'PUT' : 'POST'
      
      const response = await fetch(REQUEST_URL, {
        method: REQUEST_METOD,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Created:', data)
        // Redirect or show success message
      }
    } catch (error) {
      console.error('Failed to create content:', error)
    }
  }

  // UI-schema Fields
  function renderField(element: { field: string; widget: string; placeholder?: string; rows?: number;  min?: number; max?: number }) {
    if(!content && mode == 'read') return null

    const fieldSchema = (dataSchema.properties as Record<string, any>)[element.field]
    const value = getNestedValue(formData, element.field)// formData[element.field] || ''

    if (mode === 'read') {
      switch (element.widget) {
        case 'input':
          return <div className={element.field}>{value}</div>
        case 'textarea':
          return <div className={element.field}>{value}</div>
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
        default:
          return <div className={element.field}>{value}</div>
      }
   }
    
    switch (element.widget) {
      case 'input':
        return (
          <input
            type="text"
            value={value}
            className={element.field}
            placeholder={element.placeholder}
            onChange={e => handleChange(element.field, e.target.value)}
          />
        )
      case 'select':
        {
          const selectValue = value as string || ''
          
          return (
            <select id={selectValue} 
            className={selectValue}
            value={selectValue}
            onChange={e => handleChange(element.field, e.target.value)}
            >
              <option>-- {element.field.replace('_',' ')} --</option>
              {fieldSchema?.enum?.map((opt: string) => 
                <option key={opt} value={opt} >{opt}</option>
              )}
            </select>
        )}
      case 'slider':
        return (
          <div className='slider'>
            <input
              type="range"
              min={element.min || fieldSchema?.minimum || 1}
              max={element.max || fieldSchema?.maximum || 10}
              value={formData[element.field] || element.min || 1}
              onChange={e => handleChange(element.field, Number(e.target.value))}
            />
            <span>{formData[element.field] || element.min || 1}</span>
          </div>
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
      default:
        return <p className='hideme'>Unknown widget: {element.field}</p>
    }
  }

// Loading...
  if (mode == 'read' && loading) return <div>Loading...</div>
  if (mode == 'read' && !content) return <div>Content not found</div>
  
// Render Content
  return mode == 'edit'? (
    <form className='json-form'
      onSubmit={async (e) => {
        e.preventDefault()
        handleSubmit(e)
      }}>
      {uiSchema.elements.map(el => (
        <div key={el.field} >
          {/* <label>{el.field}</label> */}
          {renderField(el)}
        </div>
      ))}
      <button className='submit' type="submit">Save</button>
    </form>
  ) : (
    <article>
      <div>
      {
        uiSchema.elements.map(el => <div key={el.field}>{renderField(el)}</div>)
      }
      <div className='social'>social tools</div>
      </div>
    </article>
  )
}

export default DynamicForm