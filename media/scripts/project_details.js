/**
 * Script to control the project_details page.
 */

$(document).mounted(function() {
    var wizard = $('#createProjectWizard');

    // configuring buttons
    var btnSave = $('<button></button>')
        .attr('id', 'btnSave')
        .addClass('btn btn-primary')
        .html("Save")
        .click(function() {
            saveClicked();
        });

    // creating wizard
    wizard.smartWizard({
        theme: 'dots',
        toolbarSettings: {
            showNextButton: false,
            showPreviousButton: false,
            toolbarExtraButtons: [
                btnSave
            ]
        }
    });

    function saveClicked() {
        // we are leaving the create project form, and we must begin to create the
        // project.
        var form = $('#detailsForm');

        // validating
        if(!validateForm(form[0])) {
            return;
        }

        // serializing form.
        var input = serializeForm(form);

        // pushing to loading screen!
        wizard.smartWizard('next');
        $('#btnSave').hide();

        // notifying plugin host
        vscode.postMessage({
            command: 'beginInstall',
            projectDetails: input
        });
    };
});