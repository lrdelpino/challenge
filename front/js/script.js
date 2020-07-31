var titulo = document.querySelector('#title')
var texto = document.querySelector('#text')
var fecha = document.querySelector('#date')
const linksElement = document.querySelector('.container-aside aside');
const postElement = document.querySelector('.container-content #post');
async function traer() {
    await fetch('http://localhost:3001/api/post')
        .then(res => res.json())
        .then(data => {
            renderLinks(data.posts);
        });
}
function renderLinks(posts) {
    linksElement.innerHTML = '';
    posts.forEach(post => {
        //console.log('Titulo: ', post.title);
        // console.log('Text: ', post.text);
        // console.log('TimeStamp: ', post.timeStamp);
        // console.log('ID: ', post._id);
        const element = document.createElement('a');
        const salto = document.createElement('br');
        element.innerHTML = post.title;
        element.href = 'javascript:void(0)';
        element.onclick = async () => { 
            let data = await getPost(post._id);
            renderPost(data);
        };
        linksElement.appendChild(element); 
        linksElement.appendChild(salto); 
    });
    renderPost(posts[0]);
}
function renderPost(post) {
    const titulo = postElement.querySelector('#title');
    const texto = postElement.querySelector('#text');
    const tiempo = postElement.querySelector('#date');
    const borrarBtn =  postElement.querySelector('#borrar'); 
    const editarBtn =  postElement.querySelector('#editar');
    // date.getDate() + '-' + date.getMonth()+1 + '-' + date.getFullYear()
    titulo.innerHTML = post.title;
    texto.innerHTML = post.text;
    const time = new Date(post.timeStamp);
    tiempo.innerHTML = time.getDate() + '-' + time.getMonth() + '-' + time.getFullYear()
    borrarBtn.onclick = () => { deletePost(post._id); };
    editarBtn.onclick = () => { redi(post._id); };

}
async function getPost(id) {
    let info = {};
    await fetch(`http://localhost:3001/api/post/${id} `)
    .then(res => res.json())
    .then(data => {
        
        // console.log(data.post);
        info = data.post;
        
    });
    return info;
}


async function deletePost(id) {
    await fetch(`http://localhost:3001/api/post/${id}`, { method:'DELETE'})
    .then(res => res.json())
    .then(data => {
        console.log(data.message);
        renderLinks(data.posts);

    });
}

function redi(id) {
    window.location.href = `newPost.html?id=${id}`;
}

async function newPost() {
    let params = new URLSearchParams(location.search);

    let titulo = document.querySelector('#titulo');
    let texto = document.querySelector('#texto');
    let identificador = document.querySelector('#id');


    let id = params.get('id');
    // console.log(id);
    if (id != null) {
        let post = await getPost(id);
        titulo.value = post.title;
        texto.value = post.text;
        identificador.value = post._id;
    }
    
    
}

function savePost(e) {
    e.preventDefault();
    console.log(e.target.elements);
    const id =  e.target.elements.id.value;
    const post = {
        title: e.target.elements.titulo.value,
        text: e.target.elements.texto.value,
    };
    if (id !='') {
        editPost(post, id);
    } else {
        createNewPost(post);
    }
    console.log(post);

    return false;
    
}

async function editPost(post, id) {
    await fetch(`http://localhost:3001/api/post/${id}`, { 
        method:'PUT', 
        body:JSON.stringify(post),
        headers:{'Content-Type': 'application/json'},
    })
    .then(res => res.json())
    .then(data => {
        console.log('Edit: ', data)
        window.location.href = `/`;
    });
}

async function createNewPost(post) {
    await fetch(`http://localhost:3001/api/post/`, { 
        method:'POST',
        body:JSON.stringify(post),
        headers:{'Content-Type': 'application/json'},
    })
    .then(res => res.json())
    .then(data => {
        console.log('Create: ', data)
        window.location.href = `/`;
    });
}

function nuevo() {
    window.location = "newPost.html";
}