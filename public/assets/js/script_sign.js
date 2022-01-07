
function set()
{
    document.getElementById("profile").innerHTML="hi all";
}

function profileset()
{
    var x=document.getElementById('signin');
    var y=document.getElementById('profile');
    
    x.style.visibility='hidden';
    y.style.visibility='visible';

}

function logout()
{
    console.log("inside logout")
}