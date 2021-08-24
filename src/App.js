
import React, { useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { getTinymce } from '@tinymce/tinymce-react/lib/es2015/main/ts/TinyMCE';

function App() {
    function handleEditorChange(e) {
        console.log(
            'Content was updated:',
            e.target.getContent()
        );
    }

    useEffect(() => {
        getTinymce().PluginManager.add('inputBox', function(editor, url) {
            /* Add a button that opens a window */
            editor.ui.registry.addButton('inputBox', {
                text: 'Add Input Box',
                onAction: function() {
                    /* Open window */
                    // openDialog();
                    editor.insertContent('<input type="text" />');
                    // api.close();
                }
            });
            /* Adds a menu item, which can then be included in any menu via the menu/menubar configuration */
            editor.ui.registry.addMenuItem('inputBox', {
                text: 'Add Input Box',
                onAction: function() {
                    /* Open window */
                    editor.insertContent('<input type="text" />');
                }
            });
            /* Return the metadata for the help plugin */
            return {
                getMetadata: function() {
                    return {
                        name: 'Example plugin',
                        url: 'http://exampleplugindocsurl.com'
                    };
                }
            };
        });
    }, []);

    return (
        <>
            {/* <audio controls="controls" src="[blobURL]" type="audio/mp3" /> */}
            <Editor
                apiKey='75qbf7bojriy2s32x8l5f2vldsxva4hbdgdgu0fh6oo7tc5z'
                initialValue="<p>Initial content</p>"
                init={{
                    // width: 755,
                    height: 1000,
                    resize: false,
                    autosave_ask_before_unload: true,
                    powerpaste_allow_local_images: true,
                    menubar: true,
                    plugins: [
                        'inputBox a11ychecker advcode advlist anchor autolink codesample fullscreen help image imagetools tinydrive',
                        ' lists link media noneditable powerpaste preview',
                        ' searchreplace table template tinymcespellchecker visualblocks wordcount tiny_mce_wiris'
                    ],
                    external_plugins: { tiny_mce_wiris: 'https://www.wiris.net/demo/plugins/tiny_mce/plugin.js' },
                    toolbar:
                        'inputBox | a11ycheck undo redo | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | link image media | spellchecker | tiny_mce_wiris_formulaEditor | tiny_mce_wiris_formulaEditorChemistry',
                    spellchecker_dialog: true,
                    spellchecker_ignore_list: [],
                    // tinydrive_demo_files_url: '/docs/demo/tiny-drive-demo/demo_files.json',
                    // tinydrive_token_provider: function(success, failure) {
                    //   success({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huZG9lIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Ks_BdfH4CWilyzLNk8S2gDARFhuxIauLa8PwhdEQhEo' });
                    // },

                    /* enable automatic uploads of images represented by blob or data URIs*/
                    // automatic_uploads: true,
                    /*
                      URL of our upload handler (for more details check: https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_url)
                      images_upload_url: 'postAcceptor.php',
                      here we add custom filepicker only to Image dialog
                    */
                    file_picker_types: 'image media',
                    audio_template_callback: function(data) {
                        return '<audio controls="controls" src="' + data.source + '"' + (data.sourcemime ? ' type="' + data.sourcemime + '"' : '') + ' />';
                    },
                    /* and here's our custom image picker*/
                    file_picker_callback: function(cb, value, meta) {
                        // if (meta.filetype == 'file') {
                        //   cb('mypage.html', { text: 'My text' });
                        // }

                        // // Provide image and alt text for the image dialog
                        // if (meta.filetype == 'image') {
                        //   cb('myimage.jpg', { alt: 'My alt text' });
                        // }

                        // // Provide alternative source and posted for the media dialog
                        // if (meta.filetype == 'media') {
                        //   cb('movie.mp4', {});
                        // }

                        var input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/* audio/*|video/*');

                        input.onchange = function() {
                            var file = this.files[0];

                            var reader = new FileReader();
                            reader.onload = function() {
                                /*
                                  Note: Now we need to register the blob in TinyMCEs image blob
                                  registry. In the next release this part hopefully won't be
                                  necessary, as we are looking to handle it internally.
                                */
                                var id = 'blobid' + (new Date()).getTime();
                                var blobCache = getTinymce().activeEditor.editorUpload.blobCache;
                                var base64 = reader.result.split(',')[1];
                                var blobInfo = blobCache.create(id, file, base64);
                                blobCache.add(blobInfo);

                                /* call the callback and populate the Title field with the file name */
                                cb(blobInfo.blobUri(), { title: file.name });
                            };
                            reader.readAsDataURL(file);
                        };

                        input.click();
                    },
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                onChange={handleEditorChange}
            />
            <div>all good</div>
        </>
    );
}

export default App;