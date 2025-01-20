import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppError from '../layout/AppError.vue'

describe('AppError', () => {
  const defaultProps = {
    title: 'Error Title',
    actionText: 'Try Again',
  }

  it('renders properly with correct structure', () => {
    const wrapper = mount(AppError, {
      props: defaultProps,
    })

    // Check if main container exists with correct classes
    const container = wrapper.find('div[role="alert"]')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('bg-red-50')
    expect(container.classes()).toContain('text-red-700')
    expect(container.classes()).toContain('rounded-lg')
    expect(container.classes()).toContain('border')
    expect(container.classes()).toContain('border-red-200')
  })

  it('displays provided title and action text', () => {
    const wrapper = mount(AppError, {
      props: defaultProps,
    })

    expect(wrapper.find('.font-medium').text()).toBe('Error Title')
    expect(wrapper.find('button').text()).toBe('Try Again')
  })

  it('renders slot content correctly', () => {
    const slotContent = 'Error description goes here'
    const wrapper = mount(AppError, {
      props: defaultProps,
      slots: {
        default: slotContent,
      },
    })

    expect(wrapper.text()).toContain(slotContent)
  })

  it('emits onClick event when button is clicked', async () => {
    const wrapper = mount(AppError, {
      props: defaultProps,
    })

    const button = wrapper.find('button')
    await button.trigger('click')

    expect(wrapper.emitted('onClick')).toBeTruthy()
    expect(wrapper.emitted('onClick')).toHaveLength(1)
  })

  it('has correct button styling', () => {
    const wrapper = mount(AppError, {
      props: defaultProps,
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('bg-red-100')
    expect(button.classes()).toContain('hover:bg-red-200')
    expect(button.classes()).toContain('rounded-md')
    expect(button.classes()).toContain('transition-colors')
  })

  it('has correct accessibility attributes', () => {
    const wrapper = mount(AppError, {
      props: defaultProps,
    })

    const container = wrapper.find('div[role="alert"]')
    expect(container.attributes('role')).toBe('alert')
  })
})
