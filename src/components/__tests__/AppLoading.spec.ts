import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppLoading from '../layout/AppLoading.vue'

describe('AppLoading', () => {
  it('renders properly with correct structure', () => {
    const wrapper = mount(AppLoading)

    // Check if main container exists with correct classes
    const container = wrapper.find('div[role="status"]')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('fixed')
    expect(container.classes()).toContain('inset-0')
    expect(container.classes()).toContain('bg-white/90')
    expect(container.classes()).toContain('flex')
    expect(container.classes()).toContain('justify-center')
    expect(container.classes()).toContain('items-center')
    expect(container.classes()).toContain('z-50')
  })

  it('has correct accessibility attributes', () => {
    const wrapper = mount(AppLoading)

    const container = wrapper.find('div[role="status"]')
    expect(container.attributes('role')).toBe('status')
    expect(container.attributes('aria-label')).toBe('Yükleniyor')
  })

  it('renders spinner with correct styling', () => {
    const wrapper = mount(AppLoading)

    const spinner = wrapper.find('.animate-spin')
    expect(spinner.exists()).toBe(true)
    expect(spinner.classes()).toContain('border-4')
    expect(spinner.classes()).toContain('border-gray-200')
    expect(spinner.classes()).toContain('border-t-blue-600')
    expect(spinner.classes()).toContain('rounded-full')
  })

  it('displays loading text', () => {
    const wrapper = mount(AppLoading)

    expect(wrapper.text()).toContain('Yükleniyor...')
  })

  it('has correct text styling', () => {
    const wrapper = mount(AppLoading)

    const textContainer = wrapper.find('.text-center')
    expect(textContainer.exists()).toBe(true)
    expect(textContainer.classes()).toContain('text-gray-600')
  })
})
