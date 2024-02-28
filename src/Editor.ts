// The editor creator to use.
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';

import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Heading } from '@ckeditor/ckeditor5-heading';
import {
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageInsert,
    AutoImage
} from '@ckeditor/ckeditor5-image';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';



class Editor extends ClassicEditor {
    // Plugins to include in the build.
    public static override builtinPlugins = [
        Autoformat,
        BlockQuote,
        Bold,
        Essentials,
        Heading,
        Image,
        ImageCaption,
        ImageStyle,
        ImageToolbar,
        ImageInsert,
        AutoImage,
        Indent,
        Italic,
        Link,
        List,
        Paragraph,
        Table,
        TableToolbar,
        TextTransformation
    ];

    public static override defaultConfig = {
        toolbar: {
            items: [
                'heading',
                '|',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                '|',
                'outdent',
                'indent',
                '|',
                'insertImage',
                'blockQuote',
                'insertTable',
                'undo',
                'redo'
            ]
        },

        // This value must be kept in sync with the language defined in webpack.config.js.
        language: 'ko',
        image: {
            toolbar: [
                'toggleImageCaption',
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side'
            ]
        },
        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells'
            ]
        }
    };
}

export default Editor;