let officerPreviewContainer = document.querySelector('.officer-preview');
let ambassadorPreviewContainer = document.querySelector('.ambassador-preview');

let ambassadorPreviewBox = ambassadorPreviewContainer.querySelectorAll('.preview');
let officerPreviewBox = officerPreviewContainer.querySelectorAll('.preview');


document.querySelectorAll('.officer-container .officer').forEach(officer =>{
  officer.onclick = () =>{
    officerPreviewContainer.style.display = 'flex';
    let name = officer.getAttribute('data-name');
    officerPreviewBox.forEach(preview =>{
      preview.classList.toggle(
        'active',
        preview.getAttribute('data-target') == name
      )
    });
  };
});

document.querySelectorAll('.ambassador-container .ambassador').forEach(ambassador =>{
  ambassador.onclick = () =>{
    ambassadorPreviewContainer.style.display = 'flex';
    let name = ambassador.getAttribute('data-name');
    ambassadorPreviewBox.forEach(preview =>{
      preview.classList.toggle(
        'active',
        preview.getAttribute('data-target') == name
      )
    });
  };
});

document.querySelectorAll('.preview .fa-times').forEach(closeBtn =>{
  closeBtn.onclick = () =>{
    let preview = closeBtn.parentElement;
    let container = preview.parentElement

    preview.classList.remove('active');
    container.style.display = 'none';
  };
});

/*previewBox.forEach(close =>{
  close.querySelector('.fa-times').onclick = () =>{
    close.classList.remove('active');
    preview.parentElement.style.display = 'none';
  };
});
*/