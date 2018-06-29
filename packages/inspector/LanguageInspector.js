'use strict';

Vue.component('LanguageInspector', {
    template: `
        <ui-prop name="Key">
            <ui-input class="flex-1" v-value="target.key.value"></ui-input>
        </ui-prop>
        <template v-for="(index, key) in target.paramKeys.value">
            <ui-prop name="{{target.paramKeys.value[index].value}}">
                <ui-input class="flex-1"
                    v-bind:value="getParamValue(index)"
                    v-on:change="setParamValue(index, $event)">
                </ui-input>
            </ui-prop>
        </template>
        <ui-prop name="Format" readonly>
            <ui-input class="flex-1" v-bind:value="target.format.value"></ui-input>
        </ui-prop>
        <ui-prop name="String" readonly>
            <ui-input class="flex-1" v-bind:value="target.string.value"></ui-input>
        </ui-prop>
        <ui-prop name="Config" style="padding-top: 10px">
            <ui-asset
                class="flex-1"
                type="folder"                
                v-bind:value="getConfig()"
                v-on:change="setConfig($event)">
            </ui-asset>
        </ui-prop>
        <ui-prop name="Language">
            <ui-select class="flex-1" v-bind:value="getLanguage()" v-on:confirm="setLanguage($event)">
                <template v-for="(index, key) in getLanguages()">
                    <option value="{{key.value}}">{{key.value}}</option>
                </template>
            </ui-select>
        </ui-prop>
    `,

    data() {
        return {};
    },

    props: {
        target: {
            twoWay: true,
            type: Object,
        },
    },

    methods: {
        getParamValue(index) {
            return this.target.paramValues.value[index].value;
        },
        setParamValue(index, event) {
            let attrib = this.target.paramValues.value[index];
            attrib.value = event.detail.value;
            Editor.UI.fire(this.$el, "target-change", {
                bubbles: true,
                detail: attrib,
            });
        },
        getConfig() {
            return this.target.config.value;
        },
        setConfig(event) {
            let attrib = this.target.config;
            attrib.value = event.detail.value;
            Editor.UI.fire(this.$el, "target-change", {
                bubbles: true,
                detail: attrib,
            });
        },
        getLanguages() {
            return this.target.languages.value;
        },
        getLanguage() {
            return this.target.language.value;
        },
        setLanguage(event) {
            let attrib = this.target.language;
            attrib.value = event.detail.text;
            Editor.UI.fire(this.$el, "target-change", {
                bubbles: true,
                detail: attrib,
            });
        },
    },
});