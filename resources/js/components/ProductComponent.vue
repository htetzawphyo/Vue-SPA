<template>
    <div class="container my-5">
            <!-- Form -->
        <div class="row mb-3">
            <div class="col-8 offset-4">
                <div class="row">
                    <div class="col-7">
                        <div>
                            <button class="btn btn-primary" @click="create">
                                <i class="fa-solid fa-circle-plus"></i> Create
                            </button>
                        </div>
                    </div>
                    <div class="col-5">
                        <form @submit.prevent="view">
                            <div class="input-group">
                                <input type="text" placeholder="Search..." class="form-control rounded-0 shadow-none" v-model="search">
                                <div class="input-group-append">
                                    <button type="submit" class="btn btn-primary rounded-0">
                                        <i class="fa-solid fa-magnifying-glass"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>                            
            </div>
        </div>
            <!-- Form End -->

            <!-- Table -->
        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header h4">{{ isEditMode ? 'Edit' : 'Create'}}</div>
                    <div class="card-body">
                        <form @submit.prevent="isEditMode ? update() : store()" @keydown="product.onKeydown($event)">
                            <AlertError :form="product"/>
                            <div class="form-group">
                                <label>Name</label>
                                <input type="text" class="form-control" v-model="product.name"
                                :class="{ 'is-invalid': product.errors.has('name') }">
                                <HasError :form="product" field="name" />
                            </div>
                            <div class="form-group">
                                <label>Price</label>
                                <input type="number" class="form-control" min="0" v-model="product.price"
                                :class="{ 'is-invalid': product.errors.has('price') }">
                                <HasError :form="product" field="price" />
                            </div>
                            <button class="btn btn-primary mt-3" type="submit">
                                <i class="fa-regular fa-floppy-disk"></i> Save
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in products" :key="product.id">
                            <td>{{ product.id }}</td>
                            <td>{{ product.name }}</td>
                            <td>{{ product.price }}</td>
                            <td>                                
                                <button class="btn btn-warning btn-sm" @click="edit(product)">
                                    <i class="fa-solid fa-pen-to-square"></i> Edit
                                </button>
                                <button class="btn btn-danger btn-sm" @click="destroy(product.id)">
                                    <i class="fa-sharp fa-solid fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>
            <!-- Table End -->
    </div>
</template>

<script>
import axios from 'axios'; 
import { Form } from 'vform';

    export default{
        name: 'ProductComponent',
        data() {
            return {
                isEditMode: false,
                products: [],
                search: '',
                product: new Form({
                    id: '',
                    name: '',
                    price: ''
                })
            }
        },
        methods: { 
            view() {
                this.$Progress.start();

                // /?search=${this.search} for search function 
                axios.get(`/api/product/?search=${this.search}`)
                    .then( res => {
                        this.products = res.data;
                        this.$Progress.finish();
                    })
                    .catch( error => {
                        console.log("ERROR:: ", error.response.data);
                        this.$Progress.fail();
                    })
            },

            create() {
                this.product.clear();
                this.isEditMode = false;
                this.product.reset();
            },
            
            store() {
                this.product.post('/api/product')
                    .then( res => {
                        this.view();
                        this.product.reset();
                        Toast.fire({
                                icon: 'success',
                                title: 'Created successfully'
                            })
                    })
                    .catch( error => {
                        console.log("ERROR:: ", error.response.data.errors)
                    })
            },

            edit(product) {
                this.product.clear();
                this.isEditMode = true;
                this.product.fill(product);
            },

            update() {
                this.product.put(`/api/product/${this.product.id}`)
                    .then( response => {
                        this.view();
                        this.product.reset();
                        Toast.fire({
                                icon: 'success',
                                title: 'Updated successfully'
                            })
                    })
                    .catch( error => {
                        console.log("ERROR:: ", error.response.data)
                    })
            },

            destroy(id) {
                Swal.fire({
                title: 'Are you sure?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                if (result.isConfirmed) {             

                    axios.delete(`/api/product/${id}`)
                        .then( response => {
                            this.view();
                            Swal.fire({ title: 'Deleted', icon: 'success'});
                            Toast.fire({
                                icon: 'success',
                                title: 'Deleted successfully'
                            })
                        } )
                        .catch( error => {
                            console.log("ERROR:: ", error.response.data)
                        })                    
                }
                })
            }
        },
        created() {
            return this.view();
        }
    }
</script>