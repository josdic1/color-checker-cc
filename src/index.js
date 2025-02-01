/** --------------------- 🏗️ INITIAL SETUP --------------------- **/

const init = () => {

  /** --------------------- DOM Elements--------------------- **/

  const cube = document.getElementById("color-cube")
  const list = document.getElementById("color-list")

  /** --------------------- STATEFUL VARS--------------------- **/
  let isLoading = true
  let inEditMode = false
  let colors = []
  let formData = { title: '', code: '' }
  let selectedColor = { id: '', title: '', code: '' }

  /** --------------------- INIT FETCH --------------------- **/

  fetchColors()

  /** ---------------------EVENT HANDLERS  --------------------- **/



  /** --------------------- 🎨 RENDER FUNCTIONS --------------------- **/

  function renderColorCube() {


    const cubeHtml =
      `   <h1 id="colorCube" style="{ 'color': 'red'}">COLOR</h1>`

    cube.innerHTML = cubeHtml
  }



  function renderColorList(data) {

    const listMap = data.map(item => (
      `<tr id=${item.id}>
        <td>${item.id}</td>
         <td>${item.title}</td>
          <td>${item.code}</td>
          <td>
            <button type='button' button id='view-${item.id}'>View</button>
          </td>
          <td>  
            <button type='button' button id='view-${item.id}'>Edit</button>
          </td>
          <td>  
            <button type='button' button id='view-${item.id}'>Del</button>
          </td>
      </tr>`
    ))

    const listHtml =
      `<table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Color</th>
            <th>Code</th>
            <th>View</th>
            <th>Edit</th>
            <th>Del</th>
            <th>
            </th>
          </tr>
        </thead>
        <tbody>
          ${listMap}
        </tbody>
      </table>`

    list.innerHTML = listHtml
  }



  /** --------------------- 🎯 HANDLER FUNCTIONS --------------------- **/


  /** --------------------- 🛠️ UTILITY FUNCTIONS --------------------- **/


  /** --------------------- 📡 API CALLS --------------------- **/

  async function fetchColors() {
    try {
      const r = await fetch(`http://localhost:3000/colors`)
      if (!r.ok) {
        throw new Error('Bad GET response')
      }
      const data = await r.json()
      renderColorCube()
      renderColorList(data)
      colors = data
    } catch (error) { console.error('GET: ', error) }
  }

  /** --------------------- 🗑️ CLEANUP FUNCTIONS --------------------- **/


  /** --------------------- 🚀 INIT APP --------------------- **/

}

window.addEventListener("DOMContentLoaded", init)