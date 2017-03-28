Vue.component('store', {
    template: "#store-template",
    props: ['store']
})

new Vue({
    el: '#app',
    data: {
        stores: DATA,
        selected: 0,
        show_modal: false,
        command_text: ''
    },
    methods: {
        command(value) {
            switch (value) {
                case "mostrar":
                    this.showModal()
                    break;
                case "ocultar":
                    this.hideModal()
                    break;
                case "siguiente":
                    this.comingStore(this.selected + 1)
                    break;
                case "atras":
                    this.comingStore(this.selected - 1)
                    break;
                default:
                    if (value.length > 15) {
                        let data = value.split('promociones de ')
                        if (data.length === 2) {
                            let next_store = this.stores.findIndex(s => s.keys.find(k => k === data[1]))
                            this.comingStore(next_store);
                        }
                    }
                    break;
            }
        },
        comingStore(value) {
            let stores = this.stores.length - 1
            if (value > -1 && value <= stores)
                this.selected = value;
        },
        showModal() {
            this.show_modal = true
            this.$nextTick(() => {
                let modal = this.$refs.modal
                TweenMax.set(modal, {
                    opacity: 1
                })
                TweenMax.to(modal, 0.4, {
                    scale: 1
                })
            })
        },
        hideModal() {
            if (this.show_modal)
                TweenMax.to(this.$refs.modal, 0.4, {
                    scale: 0,
                    opacity: 0,
                    onComplete: () => {
                        this.show_modal = false
                    }
                })
        },
        beforeEnter(el) {
            TweenMax.set(el, {
                opacity: 0,
                left: '-100%'
            })
        },
        enter(el, done) {
            TweenMax.to(el, 0.6, {
                opacity: 1,
                left: '50%',
                onComplete: done
            })
        },
        leave(el, done) {
            TweenMax.to(el, 0.6, {
                opacity: 0,
                left: '150%',
                onComplete: done
            })
        }
    },
    watch: {
        'command_text' (value) {
            this.command(value)
        }
    }
})