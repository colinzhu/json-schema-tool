document.addEventListener('alpine:init', () => {
    Alpine.data('jsonSchemaTool', () => ({
        response: '',
        jsonSchemaUrl:'',
        jsonSchemaStr: '',
        jsonSchema:{},
        jsonSubSchemaList: {},
        jsonMsgStr: '',

        async loadExampleSchema() {
            try {
                this.jsonSchemaUrl='example-schema.json'
                this.jsonSchemaStr = await (await fetch(this.jsonSchemaUrl)).text();
                this.parseJsonSchemaStr();
            } catch (err) {
                console.log("error loading json schema from: " + this.jsonSchemaUrl, err)
            }
        },
        clearJsonSchema() {
            this.jsonSchemaStr = '';
            this.jsonSchema = {};
            this.jsonSubSchemaList = {};
        },
        parseJsonSchemaStr() {
            this.jsonSchema = JSON.parse(this.jsonSchemaStr);
            this.toSubSchemaList("root", this.jsonSchema);
            // console.log("jsonSubSchemaList", this.jsonSubSchemaList);
        },
        toSubSchemaList(key, schema) {
            const fields = schema["properties"];
            if (fields) {
                this.jsonSubSchemaList[key] = schema
                for (const [k, v] of Object.entries(fields)) {
                    this.toSubSchemaList(key + '.' + k, v);
                }
            }
        },
        async loadExampleJson(){
            this.jsonMsgStr = await (await fetch("example-json.json")).text();;
        },
        async validateJson() {
            this.jsonSchema = JSON.parse(this.jsonSchemaStr);
            const schema = new Schema(this.jsonSchema);
            await schema.deref(); // Dereference remote schemas

            try {
                const msgObj = JSON.parse(this.jsonMsgStr);
                const isValid = schema.validate(msgObj).toString()
                console.log("msgObj", msgObj);
                const errors = schema.errors(msgObj);
                this.response = "result: " + isValid;
                for (const error of errors) {
                    console.log(error.message)
                    this.response = this.response + "\r\n" + error.message;
                }
            } catch (err) {
                this.response = "not a valid json message: " + err.message;
                console.log("err", err);
            }
            console.log("response", this.response);
        }
    }))

})