import { useEffect, useRef, useState } from 'react'
import { Store, FieldEntity, NamePath, FormInstance } from './types'
import { SECRET } from './useform'
import { useFormInstance } from './useforminstance'

export function useWatch<FormValues extends Store | any>(
  name: NamePath | NamePath[],
  form: FormInstance | null
) {
  const latestValue = useRef<FormValues>()
  const [_, forceUpdate] = useState(0) // 用于触发重新渲染的状态变量
  let formInstance = useFormInstance()
  formInstance = form ?? formInstance

  useEffect(() => {
    if (!formInstance) {
      // 可以考虑添加错误处理逻辑，例如抛出错误或返回默认值
      return
    }

    // 定义一个更新值的函数
    const updateValue = () => {
      if (!formInstance) return
      if (Array.isArray(name))
        latestValue.current = formInstance.getFieldsValue(name) as FormValues
      else latestValue.current = formInstance.getFieldValue(name) as FormValues

      forceUpdate((prev) => prev + 1) // 触发重新渲染
    }

    // 立即更新值
    updateValue()
    // 注册一个更新监听器
    const unregister = formInstance
      .getInternal(SECRET)
      .registerUpdate(
        { onStoreChange: () => updateValue() } as unknown as FieldEntity,
        name
      )
    // 组件卸载时移除监听器
    return () => unregister()
  }, [formInstance, name]) // 添加 forceUpdate 到依赖数组

  // 返回最新的值
  return latestValue.current
}
