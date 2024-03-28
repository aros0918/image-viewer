const selectFolderButton = document.getElementById('select-folder');
const imageContainer = document.getElementById('image-container');
const previousButton = document.getElementById('previous');
const nextButton = document.getElementById('next');
const showUrlButton = document.getElementById('show-url');
const downloadButton = document.getElementById('download');
const googleurl = document.getElementById('gooleurl');
const csvButton = document.getElementById('csvbutton');
const checkbox = document.getElementById("outputCheckbox");
const finishbutton = document.getElementById("finishbutton");
let headers;
let imageUrls = [];
const data = [];
let currentIndex = 0;
const csvFile = document.getElementById("csvFile");
csvFile.addEventListener('change', function() {
  if (csvFile.files.length > 0) {
    const input = csvFile.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        parseCSV(text)
        console.log(data)
      
    };
    reader.readAsText(input);
    setTimeout(() => {
      checkbox.focus();
      console.log("focuse")
    }, 2000);
    
  } else {
    
  }
});


function parseCSV(csvData) {
  const lines = csvData.split('\n');
  
  headers = lines[0].split(',');
  console.log(headers[headers.length - 1])
  headers[headers.length - 1] = headers[headers.length - 1].substring(0, headers[headers.length - 1].length - 1)
  console.log(headers)
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    
    const entry = {};
    for (let j = 0; j < headers.length; j++) {
      entry[headers[j]] = values[j];
    }
    let googleurlget = '';
    for(let k = headers.length; k < values.length; k++) {

        googleurlget += ',';
      
      googleurlget += values[k];
   
    }
    entry[headers[headers.length-1]] += googleurlget;
    entry[headers[headers.length-1]] = entry[headers[headers.length-1]].substring(1);
    entry[headers[headers.length-1]] = entry[headers[headers.length-1]].substring(0, entry[headers[headers.length-1]].length-2)
    data.push(entry);
    
  }
}

 
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    showPreviousImage();
  } else if (event.key === 'ArrowRight') {
    showNextImage();
  }
});
// document.addEventListener('keydown', function(event) {
//   if (event.code === 'Space') {
//     if(checkbox.checked){
//       checkbox.checked = true;
//       console.log("Checkbox button is clicked");
//       imageUrls[currentIndex].approve = true;
//     }
      
//     else{
//       checkbox.checked = false;
//       console.log("Checkbox button is unclicked");
//       imageUrls[currentIndex].approve = false;
//     }
//   }
// });
selectFolderButton.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.webkitdirectory = true;
  input.addEventListener('change', () => {
    const files = input.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const imageUrl = reader.result;
          const imageName = file.name; // Get the image name
          imageUrls.push({ url: imageUrl, name: imageName, approve: false }); // Store both the URL and name
          if (imageUrls.length === 1) {
            displayImage();
          }
        };
      }
    }
  });
  input.click();
});
previousButton.addEventListener('click', showPreviousImage);
nextButton.addEventListener('click', showNextImage);
finishbutton.addEventListener('click', () => {
  let count = 0;
  let csv;
  let headercsv;
  for(let i = 0; i < headers.length; i++){
    headercsv += headers[i];
    headercsv += ',';
  }
  headercsv += '\n';

  // for(let i = 0; i < data.length; i++){
  //   if(data[i].filename === imageUrls[currentIndex].name){
  //     googleurl.value = data[i].link;
  //   }
  // }
  // checkbox.checked = imageUrls[currentIndex].approve;
  let filenames;
  let addresses;
  csv = headercsv.substring(9);
  for(let j = 0; j < imageUrls.length; j++){
    if(imageUrls[j].approve === true){
      for(let i = 0; i < data.length; i++){
        if(data[i].filename === imageUrls[j].name){
          filenames = ('"' + data[i].filename + '"');
          filenames = filenames.replace(/#/g, "");
          csv += filenames
          csv += ',';
          addresses = ('"' + data[i].address + '"');
          addresses = addresses.replace(/#/g, "");
          csv += addresses
          csv += ',';

          csv += data[i].city;
          csv += ',';
          csv += data[i].state;
          csv += ',';
          csv += data[i].zipcode;
          csv += ',';
          csv += data[i].map_year;
          csv += ',';
          csv += data[i].image_captured_date;
          csv += ',';
          csv += data[i].image_type;
          csv += ',';
          csv += ('"' + data[i].link + '"');
          csv += '\n';
        }
      }

      
    }
  }
  let hiddenElement = document.createElement('a');  
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);  
  hiddenElement.target = '_blank';  
    
  //provide the name for the CSV file to be downloaded  
  hiddenElement.download = 'qualified images.csv';  
  hiddenElement.click();  
  console.log(count)

})
function showPreviousImage() {
  if (currentIndex === 0) {
    currentIndex = imageUrls.length - 1;
  } else {
    currentIndex--;
  }
  displayImage();
  for(let i = 0; i < data.length; i++){
    if(data[i].filename === imageUrls[currentIndex].name){
      // googleurl.textContent  = data[i].link;
      googleurl.href = data[i].link;
    }
  }
  checkbox.checked = imageUrls[currentIndex].approve;
}

function showNextImage() {
  if (currentIndex === imageUrls.length - 1) {
    currentIndex = 0;
  } else {
    currentIndex++;
  }
  displayImage();

  for(let i = 0; i < data.length; i++){
    if(data[i].filename === imageUrls[currentIndex].name){
      // googleurl.textContent  = data[i].link;
      googleurl.href = data[i].link;
    }
  }
  
  checkbox.checked = imageUrls[currentIndex].approve;
}
imageContainer.addEventListener('wheel', (event) => {
  const img = imageContainer.querySelector('img');
  const delta = Math.sign(event.deltaY);
  const newWidth = img.width + delta * 20;
  const newHeight = img.height + delta * 20/ img.width * img.height;
  img.style.width = `${newWidth}px`;
  img.style.height = `${newHeight}px`;
});

function displayImage() {
  const imageUrl = imageUrls[currentIndex].url;
  const imageName = imageUrls[currentIndex].name;
  imageContainer.innerHTML = `<img src="${imageUrl}" alt="${imageName}">`;
}
checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    console.log("Checkbox button is clicked");
    imageUrls[currentIndex].approve = true;
  } else {
    console.log("Checkbox button is unclicked");
    imageUrls[currentIndex].approve = false;
  }
});
