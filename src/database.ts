const PORT = 8282;

export function getUsers(id ?: number) {
    console.log("We here");
    let endpoint = "/api/users"//  + id ? `/${id}` : ""
    var xhr = new XMLHttpRequest()
    xhr.onload = () => {
        console.log("aaa");
        console.log(xhr.responseText)}
    xhr.open('GET', `http://localhost:${PORT}${endpoint}`, true)
    xhr.send();
}
