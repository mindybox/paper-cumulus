/* global $ */
/* global jQuery */

class AJAXCRUDHandler {
    
    constructor(lightBoxObj, spinnyObj) {
        this.lightBox = lightBoxObj ? lightBoxObj : false;
        this.spinny = spinnyObj ? spinnyObj : false;
        
        this.popupMenu; //popup object set at beginning of scene_edit_master
        this.popupMenu_strip; //popup object for strip 
    }
    

    // ------------------------------
    // Methods
    // ------------------------------
    ajax_frameCreate(stripId, args){
        
        console.log("FrameCreate under Strip id: " + stripId);
        if(!stripId || Number(stripId) < 0){return;}
        
        var spinny = this.spinny;
        var formInfo = args["formData"]; // warning: could be $form, or formData
        var $form = $(document).find("#frame_create_form");
        
        var frameCreateResp = window.flipbookLib.submitFormAjaxly(
            formInfo,
            '/api/strip/'+stripId+'/frame/create/',
            {'method': 'POST',
             'processData': false,
             'contentType': false
            },
            function(){
                console.log("ajax frame create!");
                renderNewFrameContainer(stripId);
                
            });
        frameCreateResp.success(function(data){
            console.log("sucessfully created frame");

            /////// RENDER ///////
            renderFrameContainer(data, stripId);
            //////////////////////
        });
        
    }
    
      
        
        
    ajax_frameEdit(frameId){
    
        // Verify valid frameId
        if (frameId=="-1"){return;} //STOP, if frameid is not set.
        
        //open modal
        var spinny = this.spinny;
        var $lbCover = this.lightBox;
        var $lbModal = $(this.lightBox.modalTemplate);
        $lbModal.appendTo('body');
    
        // turn on lightbox
        $lbCover.setClickEventFunc(function(){
            $lbModal.remove(); //close edit modal
        });
        $lbCover.turnOn();
        
        
        //json_partial 
        var frameEditResp = window.flipbookLib.getJSONPartial(
            '/flipbooks/json_partials/frame_edit_form/'+frameId);
        
        frameEditResp.success(function(data){
            var $frameEditForm = $(data['html_template']);
            $lbModal.append($frameEditForm);
            
            // This form has each individual field as its own form
            
            // A. Bind note submit
            $('#frame_note_form').submit(function(event){
                event.preventDefault();
                var $frameForm = $(this);

                var editNoteResp = window.flipbookLib.submitFormAjaxly(
                    $(this), 
                    '/api/frame/'+frameId+'/update/', 
                    {'method': 'PATCH'},
                    function(){console.log("Attempt ajax edit note");});
                editNoteResp.success(function(data){
                    
                    /////// RENDER FIELD: note///////
                    $frameForm.find('#field_note').children('.field_value').text(data['note']);
                    //////////////////////
                });
            });
            
            // B. Bind frame_image submit
            $('#frame_image_form').submit(function(event){

                event.preventDefault();
                var $frameForm = $(this);
                
                //prep form data
                var formData = new FormData($(this)[0]);

                var editFrameResp = window.flipbookLib.submitFormAjaxly(
                    $(this),
                    '/api/frame/'+frameId+'/update/-',
                    {'method': 'PATCH',
                     'processData': false,
                     'contentType': false
                    },
                    function(){
                        //show loading animation
                        var $frameImageContainer = $('#frame_image_form').find('#field_frame_image').children('.field_value');
                        spinny.appendSpinnyTo(
                            $frameImageContainer);
                            //{"min-width": "400px", "max-width": "400px", "min-height":"250px"});
                    }
                );
                editFrameResp.success(function(data){
                    
                    /////// RENDER FIELD: image///////
                    var $frameImageContainer = $('#frame_image_form').find('#field_frame_image').children('.field_value');
                        $frameImageContainer.html('');
                        $frameImageContainer.append('<img src="' + data['frame_image']+ '" width="400px"/>');
                    var $frameImageInfoContainer = $('#frame_image_form').find('#field_frame_image_file_info').children('.field_value');
                        $frameImageInfoContainer.html(data['frame_image']);
                    /////////////////////////////////
                    
                    /////// RENDER thumbnail (on list view) ///////
                    var frameId = data['id'];
                    var stripId = data['strip'];
                    
                    var $frameThumb = $('.strip_flex_container[stripid=' + stripId + ']').find('.thumb[frameid='+ frameId +']');
                        $frameThumb.children("img").attr("src", data['frame_thumbnails']['thumb']);
                    ///////////////////////////////////////////////
                });
            });
            
        }); //end: frame edit response
    

    } // end: ajax_frameEdit()
    
    
    
    ajaxFrameDeleteConfirm(frameId){

        event.preventDefault();
        var $popupMenu = this.popupMenu.$menu;

        // Retrieve frame information
        if (frameId=="-1"){return;} //STOP, if frameid is not set.
        
        // DELETE happens in 2 parts.
        // First is GET, and then POST. To see POST delete, see ajax_frame_delete()
        
        var deleteResponce = window.flipbookLib.getJSONPartial(
            '/flipbooks/frame/'+ frameId +'/delete/', 
            'GET', 
            'json',
            function(){
                $popupMenu.focusout();
            });
        
        deleteResponce.success(function(data){
            /////// RENDER ///////
            // TODO: this function is back in scene_edit_master.js
            renderDeleteFrameConfirm(data, frameId, {'popupMenu': $popupMenu});
            /////////////////////
        });
        
    } //end: ajaxFrameDeleteConfirm()
    
    
    
    
    ajaxFrameDelete($form, frameid){ 
        
        var popupMenuObj = this.popupMenu;
        
        var deleteFrameResp = window.flipbookLib.submitFormAjaxly(
            $form,
            '/flipbooks/frame/'+ frameid +'/delete/',
            {'method': 'POST'}
            );
        deleteFrameResp.success(function(data){
            //show animation of deletion
            $(document).find('.thumb[frameid='+ frameid +']').animate({
                opacity: 0,
            }, 300, function() {
                // Put popup menu elsewhere so that it doesn't 
                // get deleted with the frame container.
                popupMenuObj.dislodge(); 
                $(this).remove(); //actually delete
            });
            
        });
        
    } // end: ajaxFrameDelete()
    



    ajax_strip_DeleteConfirm(stripId){
        
        event.preventDefault();
        var $popupMenu = this.popupMenu_strip.$menu;
        
        // Retrieve frame information
        var stripId = $popupMenu.attr("for");
        if (stripId=="-1"){return;} //STOP, if frameid is not set.
        
        // DELETE happens in 2 parts.
        // First is GET, and then POST. To see POST delete
        
        var deleteResponce = window.flipbookLib.getJSONPartial(
            '/flipbooks/strip/'+ stripId +'/delete/', 
            'GET', 
            'json',
            function(){
                console.log("DELETE CONFIRM");
                $popupMenu.focusout()});
        
        deleteResponce.success(function(data){

            /////// RENDER ///////
            renderStripDeleteConfirm(data, stripId, {'popupMenu': $popupMenu});
            /////////////////////
        });
            
    }
    
}
    
