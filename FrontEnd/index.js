//fonction pour récupérer les projets de l'api
async function getProjects()
{
	
     return fetch("http://localhost:5678/api/works").then (function(response)
    {
        return response.json();
    })
    .then(function(works)
    {
        return works;
    })

}

//fonction pour récupérer les works de l'api
async function getCategories()
{
     return fetch("http://localhost:5678/api/categories").then (function(response)
    {
        return response.json();
    })
    .then(function(categories)
    {
        return categories;
    })

}


//fonction init pour lancer l'affichage des boutons 
async function init()
{  
	afficherButtons();
	logoutInit();	
	filterAndShowWorks("tous");
}

//initialisation
function logoutInit()
{
	document.querySelector(".logout").addEventListener('click' , function(){localStorage.removeItem('token');})
}

//filtrer les projects et les afficher
async function filterAndShowWorks( categoryId )
{
	const works = await getProjects();
	const showAll = categoryId == "tous"

	//affichage de la categorieId et nombre de works by id
	
	document.getElementById("works").innerHTML = "";

	for(const work of works)
	{
		if (work.categoryId === categoryId || showAll)
		{
			const figure =  document.createElement('figure');
            const img = document.createElement('img');
            const figcaption = document.createElement('figcaption');

            img.src = work.imageUrl;
            img.alt = work.title;
            figcaption.innerHTML=work.title; 

			figure.appendChild(img);
            figure.appendChild(figcaption);


            document.getElementById("works").appendChild(figure);

		}			
	}
}

//appeler init pour initialiser
init();

// creation des buttons pour filtrer les projects
async function afficherButtons()
{ 	
	if( localStorage.getItem('token') ==null ) //Je ne suis pas connecté
		{
			document.querySelector(".login").classList.remove("hidden");
			document.querySelector(".logout").classList.add("hidden");
			document.querySelector(".js-modal").classList.add("hidden");

			const categories = await getCategories();

			const buttonTous =  document.createElement('button');
			buttonTous.innerHTML="Tous";
			buttonTous.id = "tous";
			document.getElementById("filtres").appendChild(buttonTous);
		
			buttonTous.addEventListener("click" , function()
			{
				filterAndShowWorks("tous")
			});
					
			for( const category of categories )
			{
				const button =  document.createElement('button');
				button.innerHTML=category.name;
				button.id=category.name;
				document.getElementById("filtres").appendChild(button);
				button.addEventListener("click" , function(){filterAndShowWorks(category.id)});
			}
		}
	else 
		{
			filterAndShowWorks("tous")
			document.querySelector(".login").classList.add("hidden");
			document.querySelector(".logout").classList.remove("hidden");
			document.querySelector(".js-modal").classList.remove("hidden");
			
		}
}

/* ---MODALE--- */

let modal = null;

//OPENING MODAL
const openModal = function(e)
{
	//Modal setup
	e.preventDefault();
	const target = document.querySelector(e.target.getAttribute('href'));
	console.log(target);
	target.style.display= null;
	target.removeAttribute('aria-hidden');
	target.setAttribute('aria-modal', 'true');
	modal = target
	modal.addEventListener('click' , closeModal)
	//Close button listener
	modal.querySelectorAll('.js-modal-close').forEach(a => {
		a.addEventListener('click' , closeModal)
	})
	//Stop Propagation
	modal.querySelectorAll('.js-modal-stop').forEach(a => {
		a.addEventListener('click' , stopPropagation)
	})
	//Now we add the project to the modal
	addProjectsModal();
}

//CLOSING MODAL
const closeModal = function(e)
{
	if(modal === null) return
	//La modal n'est pas nulle donc on la ferme
	e.preventDefault();
	modal.style.display= 'none';
	modal.setAttribute('aria-hidden', 'true');
	modal.removeAttribute('aria-modal');
	modal.removeEventListener('click' , closeModal)
	modal.querySelectorAll('.js-modal-stop').forEach(() => {
		removeEventListener('click' , stopPropagation) 
	});
	modal = null

	document.getElementById("first-modal").classList.remove("hidden");
}

//stopper la fermeture au click
const stopPropagation = function(e)
{
	e.stopPropagation()
}

//fermeture avec key "esc"
window.addEventListener('keydown' , function(e)
{
	if(e.key == "Escape" || e.key == "esc")
	{
		closeModal(e)
	}
})

//Button modifier
document.querySelectorAll('.js-modal').forEach(a => {a.addEventListener('click' , openModal)})


// ajout modale 2
document.getElementById('ajout').addEventListener('click' , function()
{
	document.getElementById("first-modal").classList.add("hidden");
	document.getElementById("modale_two").classList.remove("hidden");
	//Back button listener
	modal.querySelectorAll('.js-modal-back').forEach(a => {
		a.addEventListener('click' , function()  
		{
			document.getElementById("modale_two").classList.add("hidden");
			document.getElementById("first-modal").classList.remove("hidden");
		})
	})
})
	
//ajouter des projets dans la modale
async function addProjectsModal()
{
	document.getElementById("modale_two").classList.add("hidden");
	document.getElementById("first-modal").classList.remove("hidden");
    const works = await getProjects();

	document.getElementById("projects-galery").innerHTML = "";
		
    for(const work of works) 
    {
        const figure =  document.createElement('figure');
        const img = document.createElement('img');
		const deleteButton = document.createElement('button');
		const deleteIcon = document.createElement('i');

		deleteButton.addEventListener("click" ,async function(e)
		{
			e.preventDefault;
			await deleteWork(work.id);
			await addProjectsModal();
			await filterAndShowWorks('tous');

		});
            img.src = work.imageUrl;
			img.style.width='70px';
			img.style.height='auto';
            img.alt = work.title;

			deleteIcon.className="fa-solid fa-trash-can";
			deleteIcon.style="color: #ffffff;";
			

			deleteButton.appendChild(deleteIcon);

            figure.appendChild(img);
			figure.appendChild(deleteButton);
			
            document.getElementById("projects-galery").appendChild(figure);
        }
}



//suppression d'un project
async function deleteWork(id)
{
	console.log(` deleted   ${id} `)
	const tokenValue = localStorage.getItem('token');
	console.log(tokenValue)
	const response = await fetch(`http://localhost:5678/api/works/${id}`, 
	{
		method: 'DELETE',
		headers: 
		{
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${tokenValue}` // Utilise la valeur du token dans l'en-tête de la requête
		}	
	});

	if (response.ok) 
	{
		console.log("delete accomplished");
	}
	else if(response.status == '401') 
	{
		console.log("Unauthorized");
	}
}

//fin ajout dans la modale


//mettre l'image dans le choose file
const inputImg = document.querySelector("#upload_img")
inputImg.addEventListener("change", previewImg)

function previewImg()
{
	const [file] = inputImg.files 
	if(file)
	{
		const srcimg = URL.createObjectURL(file)
		console.log(srcimg)
		const previewimg = document.querySelector("#previewimg")
		console.log(previewimg)
		previewimg.src = srcimg
		previewimg.classList.remove("hidden")
		inputImg.classList.add("hidden")
		const paragrapheimg =  document.querySelector("#paragimg")
		paragrapheimg.classList.add("hidden")
		const paragrapheicon = document.querySelector("#paraicon")
		paragrapheicon.classList.add("hidden")
	} 
}

//ajouter les projects à l'api
async function uploadWork()
{

	let isSuccess = false;

	

	const imageElement = document.getElementById("upload_img").files[0];
	const titleElement = document.getElementById("textfield_work_title").value;
	const categoryElement = document.getElementById("category").value;

	// Construction du formData à envoyer
	const formData = new FormData();
	formData.append("image", imageElement);
	formData.append("title", titleElement);
	formData.append("category", categoryElement);
  
	// Appel de la fonction fetch avec toutes les informations nécessaires
	const tokenValue = localStorage.getItem('token');
	let response = await fetch("http://localhost:5678/api/works", {
		
		method: "POST",
		headers: {
			// Adding Token
			'Authorization': `Bearer ${tokenValue}` 
		},
		body: formData
	});

	//Listener sur input
	/*imageElement.addEventListener('input' , function(e)
	{
		console.log("halahala");
	}	)*/

	if (response.ok) 
	{
		isSuccess = true;
		console.log("Ajout Accomplished");
	}
	else if(response.status == '401') 
	{
		console.log("Unauthorized");
	}
	
	return isSuccess
}

// // button valider un project
document.getElementById('confirm-button').addEventListener('click' , function(e)
{
	console.log("confirme button pressed");

	if(checkInput())
	{
		if(uploadWork())
		{
			closeModal(e);
			addProjectsModal();
			filterAndShowWorks('tous');
		}
	}else{
		console.error("Invalid input")
	}
})
	
//verifier que toutes les cases sont rempli pour permettre la validation
function checkInput()
{
	let isInputCorrect = true;

	//Input element
	const imageElement = document.getElementById("upload_img").files[0];
	const titleElement = document.getElementById("textfield_work_title").value;
	const categoryElement = document.getElementById("category").value;

	//**** */
	// cibler les messages
	const errMessImg = document.querySelector("#error-img");
	const errMessTitle = document.querySelector("#error-title");
	const errMessCat = document.querySelector("#error-category");

	//Checking elements values
	if(imageElement==null)
	{
		errMessImg.innerHTML = "";
		errMessImg.innerHTML = "Image obligatoire *";
		isInputCorrect = false
	}
	if(titleElement == "")
	{
		errMessTitle.innerHTML = "";
		errMessTitle.innerHTML = "title obligatoire *";
		isInputCorrect = false;
	}
	if(categoryElement == "")
	{
		errMessCat.innerHTML = "";
		errMessCat.innerHTML = "title obligatoire *";
		isInputCorrect = false;
	}

	return isInputCorrect
}