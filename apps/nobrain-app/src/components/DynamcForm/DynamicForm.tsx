import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import staticDataSchema from '@/assets/read.data.json' with { type: 'json' }
import staticUiSchema from '@/assets/read.ui.json'
import { broker, storage } from '@nx-mono/broker'
import type { Category, ContentWithSchemas } from '@/types/content';

function DynamicForm(
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

  const [content, setContent] = useState<ContentWithSchemas | null>(null)
  const [formData, setFormData] = useState<Record<string, string | number | string[] | null>>({})
  const [categories, setCategories] = useState<Category[]>([])
  
  const dataSchema = staticDataSchema
  const uiSchema = staticUiSchema

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

  useEffect(() => {
    fetch(`${API_URL}/categories/`)
      .then(r => r.json())
      .then(setCategories)
  }, [])

  function handleChange(field: string, value: string | string[] | number) {
    // console.log(field, value);
    
    setFormData(prev => ({ ...prev, [field]: value }))
  }


// Nested JSONB DB-objects (like metadata)
  function getNestedValue(obj: Record<string, string | number | string[] | null>, path: string): string | number | string[] | undefined {    
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
      category_id: formData.category_id as number || null,  // added
      metadata: {
        content_type: 'read',
        subcategory: formData.subcategory,
        tags: formData.tags,
        priority: formData.priority || 5,
        status: formData.status,
        seo_keywords: formData.seo_keywords
      },
      parent_id: formData.parent_id,
      author_id: storage.getUser()?.id as number || 1,
    }

    try {
      const REQUEST_URL = content?.id? `${API_URL}/content/${content?.id}` : `${API_URL}/content/`
      const REQUEST_METOD = content?.id? 'PUT' : 'POST'
      
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
        const updatedContent = await response.json()
        setContent(updatedContent)
        onSaveSuccess()
      }
    } catch (error) {
      console.error('Failed to create content:', error)
    }
  }

// UI-schema Fields
  function renderField(element: { field: string; widget: string; placeholder?: string; rows?: number;  min?: number; max?: number; edit?: boolean; view?: boolean }) {
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
      case 'toggle':
        return (
          <label>
            {element.field.replace('_', ' ')}
            <input type="checkbox" />
          </label>
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
      default:
        return <p className='hideme'>Unknown widget: {element.field}</p>
    }
  }

  
// Render Content
  return mode == 'edit' ? (
    <form className='json-form'
      onSubmit={async (e) => {
        e.preventDefault()
        handleSubmit(e)
      }}>
      {uiSchema.elements.map(el => (
        <div className={el.widget==='select' || el.widget==='toggle'? 'select-box' : ''} key={el.field} >
          {/* <label>{el.field}</label> */}
          {renderField(el)}
        </div>
      ))}
      <button className='submit' type="submit">Save</button>
      {mode === 'edit' && formData && data?.id && (
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