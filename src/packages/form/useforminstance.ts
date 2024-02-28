import { useContext } from 'react'
import { FormInstance } from './types'
import { Context } from './context'

export const useFormInstance = (): FormInstance | null => {
  const context = useContext(Context)

  // 如果 context 不存在，则返回 null
  if (!context) {
    return null // 或者返回 undefined: return undefined;
  }

  // 确保 context 实例具有 FormInstance 的所有属性
  if (
    typeof context.getFieldValue === 'function' &&
    typeof context.getFieldsValue === 'function' &&
    typeof context.setFieldsValue === 'function' &&
    typeof context.resetFields === 'function' &&
    typeof context.submit === 'function'
  ) {
    return context as FormInstance<any>
  }
  // 如果 context 不满足 FormInstance 的要求，则返回 null
  console.error('The context does not implement the FormInstance interface.')

  return null
}
