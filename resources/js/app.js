require('./bootstrap');
window.Vue = require('vue').default;

import { Button, HasError, AlertError, AlertErrors, AlertSuccess} from 'vform/src/components/bootstrap5';
import Swal from 'sweetalert2';

// vue progress
import VueProgressBar from 'vue-progressbar'

Vue.use(VueProgressBar, {
  color: '#0d6efd',
  failedColor: 'red',
  height: '2px',
  thickness: '4px'
})

Vue.component('example-component', require('./components/ExampleComponent.vue').default);
Vue.component('product-component', require('./components/ProductComponent.vue').default);
Vue.component(Button.name, Button);
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);
Vue.component(AlertErrors.name, AlertErrors);
Vue.component(AlertSuccess.name, AlertSuccess);

// window.Form = Form;
window.Swal = Swal;
// for success
window.Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  

const app = new Vue({
    el: '#app',
});
