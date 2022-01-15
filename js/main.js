function createElement(name = 'div', innerHTML = '', className = '', parent) {
  let element = document.createElement(name);
  element.innerHTML = innerHTML;
  element.className = className;
  parent && parent.append(element);
  return element;
}

const getLibraries = async () => {
  let libraries = await axios.get('https://api.cdnjs.com/libraries?limit=20')
  return libraries.data.results
}

let closeLibraryData = document.querySelector('#closeLibraryData');
let libraryData = document.querySelector('#library-data');
let main = document.querySelector('#main-window');
let row = document.querySelector('.row');
let dataBox = document.querySelector('#library-data-box')

let allLibraries = [];
getLibraries()
  .then((data) => {
    data.map((obj) => {
      axios.get(`https://api.cdnjs.com/libraries/${obj.name}`)
        .then((snap) => {
          let result = snap.data
          console.log(result)
          let col = createElement('div', '', 'col-lg-6', row);
          let libraryCard = createElement('div', '', "library-card mt-3", col);
          let cardHeader = createElement('div', '', "d-flex align-items-center justify-content-between mb-3 gold", libraryCard)
          let libraryName = createElement('a', `${result.name}`, 'library-name', cardHeader);
          libraryName.onclick = () => {
            dataBox.innerHTML = '';
            main.classList.add('d-none');
            libraryData.classList.remove('d-none');
            let closeBtn = createElement('i', '', "fa fa-times", dataBox);
            closeBtn.id = 'closeLibraryData';
            closeBtn.onclick = () => {
              main.classList.remove('d-none');
              libraryData.classList.add('d-none');
            }
            let dataTitle = createElement('h1', `${result.name}`, "text-white gold", dataBox);
            let dataDescription = createElement('p', `${result.description}`, "text-secondary text-left", dataBox);
            let libraryShorts = createElement('ul', '', "library-shorts list-unstyled d-flex flex-wrap justify-content-center text-light", dataBox);
            let website = createElement('li', `${result.homepage}`, 'small-box', libraryShorts);
            let version = createElement('li', `${result.version}`, 'small-box', libraryShorts);
            let tags = createElement('li', `${result.keywords.join(', ')}`, 'small-box', libraryShorts);
            let libraryLinks = createElement('ul', ``, "library-links list-unstyled", dataBox);
            let lastAsset = result.assets[result.assets.length -  1];
            console.log('ALL ITEMS', lastAsset);
            let curVersion = lastAsset.version
            let files = lastAsset.files.reverse();
            files.forEach((fileName) => {
              let linkItem = createElement('li', '', "d-flex", libraryLinks);
              let linkUrl = createElement('p', `https://cdnjs.cloudflare.com/ajax/libs/${result.name}/${fileName}`, "link m-0", linkItem);
              let linkClipboard = createElement('i', '', "fa fa-clipboard", linkItem);
              linkClipboard.onclick = () => {
                if (linkUrl.innerHTML.includes('.js')) {
                  navigator.clipboard.writeText(
                    `<script src="${linkUrl.innerHTML}"
                    crossorigin="anonymous"></script>`
                  );
                }else if (linkUrl.innerHTML.includes('.css')){
                  navigator.clipboard.writeText(
                    `<link rel="stylesheet" href="${linkUrl.innerHTML}"
                    crossorigin="anonymous" referrerpolicy="no-referrer" />`
                  )
                }
                
              }
            })
          }
          let clipboard = createElement('i', `<i class="far fa-clipboard" data-link="${result.latest}"></i>`, '', cardHeader);
          let p = createElement('p', `${result.latest}`, 'd-none', cardHeader)
          clipboard.onclick = () => {
            if (p.innerHTML.includes('.js')) {
              navigator.clipboard.writeText(
                `<script src="${p.innerHTML}"
                crossorigin="anonymous"></script>`
              );
            }else if (p.innerHTML.includes('.css')){
              navigator.clipboard.writeText(
                `<link rel="stylesheet" href="${p.innerHTML}"
                crossorigin="anonymous" referrerpolicy="no-referrer" />`
              )
            }
            
          }
          let div = createElement('div', '', 'd-flex flex-column justify-content-between', libraryCard)
          let description = createElement('p', `${result.description}`, 'description', div);
          let tag = createElement('p', `Tags: ${result.keywords.join(', ')}`, '', div)
        })
    })
  })


