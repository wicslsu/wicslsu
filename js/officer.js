let preveiwContainer = document.querySelector('.officer-preview');
let previewBox = preveiwContainer.querySelectorAll('.preview');

document.querySelectorAll('.officer-container .officer').forEach(officer =>{
  officer.onclick = () =>{
    preveiwContainer.style.display = 'flex';
    let name = officer.getAttribute('data-name');
    previewBox.forEach(preview =>{
      let target = preview.getAttribute('data-target');
      if(name == target){
        preview.classList.add('active');
      }
    });
  };
});

previewBox.forEach(close =>{
  close.querySelector('.fa-times').onclick = () =>{
    close.classList.remove('active');
    preveiwContainer.style.display = 'none';
  };
});