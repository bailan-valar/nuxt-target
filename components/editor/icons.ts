import { defineComponent, h } from 'vue'

export const Paragraph = defineComponent({
  name: 'ParagraphIcon',
  setup() {
    return () => h('svg', {
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    }, [
      h('path', {
        d: 'M4 6h16M4 12h16M4 18h10'
      })
    ])
  }
})

export const Heading1 = defineComponent({
  name: 'Heading1Icon',
  setup() {
    return () => h('svg', {
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    }, [
      h('path', {
        d: 'M4 12h8M4 6v12M12 6v12M20 6v12'
      })
    ])
  }
})

export const Heading2 = defineComponent({
  name: 'Heading2Icon',
  setup() {
    return () => h('svg', {
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    }, [
      h('path', {
        d: 'M4 12h8M4 6v12M12 12h8M12 6v12'
      })
    ])
  }
})

export const Heading3 = defineComponent({
  name: 'Heading3Icon',
  setup() {
    return () => h('svg', {
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    }, [
      h('path', {
        d: 'M4 12h8M4 6v12M12 12h6M12 6v12M18 6v12'
      })
    ])
  }
})

export const BulletList = defineComponent({
  name: 'BulletListIcon',
  setup() {
    return () => h('svg', {
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'currentColor'
    }, [
      h('circle', { cx: '4', cy: '6', r: '1.5' }),
      h('circle', { cx: '4', cy: '12', r: '1.5' }),
      h('circle', { cx: '4', cy: '18', r: '1.5' }),
      h('path', {
        d: 'M8 6h13M8 12h13M8 18h13',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round'
      })
    ])
  }
})

export const OrderedList = defineComponent({
  name: 'OrderedListIcon',
  setup() {
    return () => h('svg', {
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'currentColor'
    }, [
      h('path', {
        d: 'M8 6h13M8 12h13M8 18h13'
      }),
      h('text', {
        x: '2',
        y: '8',
        'font-size': '6',
        fill: 'currentColor'
      }, '1'),
      h('text', {
        x: '2',
        y: '14',
        'font-size': '6',
        fill: 'currentColor'
      }, '2'),
      h('text', {
        x: '2',
        y: '20',
        'font-size': '6',
        fill: 'currentColor'
      }, '3')
    ])
  }
})

export const TaskList = defineComponent({
  name: 'TaskListIcon',
  setup() {
    return () => h('svg', {
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    }, [
      h('rect', {
        x: '3',
        y: '3',
        width: '18',
        height: '18',
        rx: '2',
        ry: '2'
      }),
      h('polyline', {
        points: '9 12 11 14 15 10'
      })
    ])
  }
})

export const Blockquote = defineComponent({
  name: 'BlockquoteIcon',
  setup() {
    return () => h('svg', {
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'currentColor'
    }, [
      h('path', {
        d: 'M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z'
      })
    ])
  }
})

export const CodeBlock = defineComponent({
  name: 'CodeBlockIcon',
  setup() {
    return () => h('svg', {
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    }, [
      h('polyline', { points: '16 18 22 12 16 6' }),
      h('polyline', { points: '8 6 2 12 8 18' })
    ])
  }
})

export const HorizontalRule = defineComponent({
  name: 'HorizontalRuleIcon',
  setup() {
    return () => h('svg', {
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    }, [
      h('line', { x1: '3', y1: '12', x2: '21', y2: '12' })
    ])
  }
})
