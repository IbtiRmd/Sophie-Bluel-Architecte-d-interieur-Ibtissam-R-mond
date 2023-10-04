



// recuperer le formulaire
const formlogin = document.getElementById('formLogin');

formlogin.addEventListener("submit" , login);

function login(event)
{
    event.preventDefault();

    const elementEmail = document.getElementById("email");

    const passWord = document.getElementById("password");

    const errorlogin = document.getElementById("error");


   /* let messages = []

    if(elementEmail.value ==='' || elementEmail.value == null)
    {
        messages.push('Mail est obligatoire')
    }

    if(passWord.value.length <= 6)
    {
        messages.push("password must be longer than 6 characters")

    }

    if(passWord.value.length > 6)
    {
        messages.push("password must be less than 10 characters")

    }

    if(messages.length > 0)
    {
        errorlogin.innerText = messages.join(', ');
    }*/


    

    fetch("http://localhost:5678/api/users/login",
    {
        method: "POST",
        headers:
        {
            "Content-type": "application/json"
        },
        body:
        
            JSON.stringify (
                {
                    'email' : elementEmail.value,
                    'password': passWord.value 
                }
            ) 
    }).then(function(response){

        

        if (!response.ok) {

            errorlogin.innerHTML = "Erreur d’identifiant ou de mot de passe"
            throw new Error("Erreur d’identifiant ou de mot de passe");
          }
          return response.json();


    }).then(function(login){


        if (login.token) 
            {
                // Stockage du tok
            localStorage.setItem('token',login.token);
            window.location.href = "./index.html";
            }

        else
            {  
                    throw new Error("Erreur lors de la connexion");   
            }
     })
}
