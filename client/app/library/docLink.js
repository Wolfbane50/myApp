angular.module('myappApp')
.component('docLink', {
  bindings: { doc: '<' },
  template: `
    <li ui-sref-active="userselected">
      <a ui-sref="docList.libdoc({id: $ctrl.doc.id })">
        {{ $ctrl.doc.title }}
      </a>

    </li>
`,
})
