import { VNode } from 'vue'
import { consoleError } from '../../vuetify-import'
import { VDataTableA } from '../../shims-vuetify'
import commonSelect from '../mixin/commonSelect'
import VDataGridSelectList from './VDataGridSelectList'
import { VNodeChildren } from 'vue/types/vnode'
import { mergeProps } from '../../utils/mergeProps'
import { Command, defaultDataGridSelectCommands } from '../../utils/ToolbarCommand'

export default commonSelect.extend({
  name: 'v-data-grid-select',
  props: {
    toolbarCommands: {
      type: Array,
      default: function () {
        return defaultDataGridSelectCommands(this as any)
      }
    },
    ...(VDataTableA as any).options.props
  },
  computed: {
    listData (): Object {
      const data = (commonSelect as any).options.computed.listData.call(this)
      mergeProps(data.props, this.$props, (VDataTableA as any).options.props)
      data.props.selectable = true
      data.props.selectedItems = this.selectedItems
      Object.assign(data.on, {
        input: (e: any[]) => {
          (this as any).selectItems(e)
        }
      })
      Object.assign(data.scopedSlots, this.$scopedSlots)
      return data
    },
    staticList (): VNode {
      if (this.$slots['no-data'] || this.$slots['prepend-item'] || this.$slots['append-item']) {
        consoleError('assert: staticList should not be called if slots are used')
      }
      const slots: VNodeChildren = []
      slots.push((this.$scopedSlots.items as any))
      return this.$createElement(VDataGridSelectList, this.listData, slots)
    }
  },
  methods: {
    genListWithSlot (): VNode {
      return this.$createElement(VDataGridSelectList, {
        ...(this as any).listData
      }, this.genSlots())
    }
  }
})
