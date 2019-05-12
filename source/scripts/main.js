
var validator = validator || {};

(function(app) {

    app.events = {
        onkeyup: 'keyup'
    };

    app.messages = {
        required: 'alanı boş bırakılamaz.',
        tckn: 'TC Kimlik Numarası doğru değil.',
        numeric: ' bu alana sadece rakam girilebilir.',
        letter: ' bu alana sadece harf girilebilir.',
        minLen: 'alanına en az %s karakter girilmelidir.',
        maxLen: 'alanına en fazla %s karakter girilebilir.',
        minVal: 'alanına en az %s değer girilmelidir.',
        maxVal: 'alanına en fazla %s değer girilebilir.'
    };

    app.ruleRegex = /^(.+?)\[(.+)\]$/,
        numericRegex = /^[0-9]+$/,
        letterRegex = /^[A-Za-z_ğüşıöçĞÜŞİÖÇ]+$/;

    app.init = function(form) {
        app.formValidate(form)
    };

    app.formValidate = function(formName) {
        this.errors = [];
        this.fields = [];
        this.form = formName;
        this.formEl = document.getElementsByName(formName);
        this.errorEl = document.createElement('div');

        this.errorEl.className = 'errors';
        this.formEl[0].insertBefore(this.errorEl, this.formEl[0].firstChild);


        var elements = this.formEl[0].getElementsByClassName('validation')

        for (let i=0; i < elements.length; i++) {
            app.addField(elements[i]);
        }

        Object.values(this.fields).forEach(function(item){
            if(item.mask){
                item.display.addEventListener(app.events.onkeyup, function(){
                    app.hooks[item.mask](this)
                });
            }
        });



        this.formEl[0].onsubmit = (function(e) {
            e.preventDefault();

            app.errors = [];

            Object.values(app.fields).forEach(function(item){
                if(item.rules){
                    item.rules.split(',').forEach(function(i){
                        var ruleSplit = i.split(':')
                        if(app.hooks[ruleSplit[0]](item.display,ruleSplit[1]) == false){
                            app.errors.push({
                                'name': item.name,
                                'message' : app.messages[ruleSplit[0]].replace('%s',ruleSplit[1])
                            })
                        }
                    })
                }
            });

            if(app.errors.length == 0){
                app.errorEl.innerHTML = '';

                var url = 'https://www.hesapkurdu.com/konut-kredisi/'+ app.value('vade') +'-ay-'+ app.currencyFormat(app.value('kredi')) +'-tl?r='+ app.currencyFormat(app.value('ev_degeri')) +'&n='+ app.value('ad') +'&s='+ app.value('soyad') +'&t='+ app.value('tckn') +'';
                app.formEl[0].action = url;

                app.formEl[0].submit();


            } else {
                var temp = "<ul>";
                app.errors.forEach(function(item){
                    temp += "<li>" + item.name + '  ' +item.message + "</li>";
                });
                temp += "</ul>"

                app.errorEl.innerHTML = temp;
            }
        });

    }

    app.currencyFormat = function(val){
        var a = val.split(',')[0],
            b = a.split('.')

        return b.join('')
    };

    app.value = function(field){
        return app.fields[field].display.value;
    };

    app.addField = function(field)  {
        this.fields[field.name] = {
            name: field.name,
            display: field,
            rules: field.getAttribute('rules'),
            mask: field.getAttribute('mask'),
            id: field.id,
            value: field.value
        };
    };

    app.hooks = {
        required: function(field) {
            var value = field.value;

            if ((field.type === 'checkbox') || (field.type === 'radio')) {
                return (field.checked === true);
            }

            return (value !== null && value !== '');
        },

        currency: function(field) {

            var fieldval = field.value;

            if(fieldval){
                var a = fieldval.replace(' TL','');
                var fieldNew = a.replace(',00','');;
                var b = fieldNew.split('.');
                var fieldVal = b.join().replace(/,/g, '')

                var val = parseFloat(fieldVal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1.').replace(/\.(\d+)$/,',$1') + ' TL';
                field.value = val;
            } else {
                field.value = '';
            }

            app.currencyFormat(field.value);

        },

        tckn: function(field){
            var a = field.value;
            if(a.substr(0,1)==0 || a.length!=11){
                return false;
            }
            var i = 9, md='', mc='', digit, mr='';
            while(digit = a.charAt(--i)){
                i%2==0 ? md += digit : mc += digit;
            }
            if(((eval(md.split('').join('+'))*7)-eval(mc.split('').join('+')))%10!=parseInt(a.substr(9,1),10)){
                return false;
            }
            for (c=0;c<=9;c++){
                mr += a.charAt(c);
            }
            if(eval(mr.split('').join('+'))%10!=parseInt(a.substr(10,1),10)){
                return false;
            }
            return true;
        },

        numeric: function(field) {
            if(field.value){
                return (numericRegex.test(field.value));
            }
        },

        letter: function(field) {
            if(field.value){
                return (letterRegex.test(field.value));
            }
        },

        minLen: function(field,val) {
            if(field.value){
                return (field.value.length >= val);
            }
        },

        maxLen: function(field,val) {
            if(field.value){
                return (field.value.length <= val);
            }
        },

        minVal: function(field,val) {
            if(field.value){
                return (parseInt(app.currencyFormat(field.value)) >= val);
            }
        },

        maxVal: function(field,val) {
            if(field.value){
                return (parseInt(app.currencyFormat(field.value)) <= val);
            }
        },

        credit: function(field,val) {

            console.log(field)

            if(field.value){
                return (parseInt(app.currencyFormat(field.value)) <= val);
            }
        }
    };

    window.formValidate = app.init;
})(validator);
