/** --------------------- 🏗️ INITIAL SETUP --------------------- **/

const init = () => {

  /** --------------------- DOM Elements--------------------- **/

  const cube = document.getElementById("color-cube")
  const form = document.getElementById("color-form")
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

  function renderColorCube(colorCode) {


    const cubeHtml =
      `<h1 id="colorCube" style="color: ${colorCode}">COLOR</h1>`;
    cube.innerHTML = cubeHtml
  }

  function renderColorForm() {
    const formHtml =
      `    <label for="title" > Color </label>
    <input id='title' name='title' placeholder='Color name here...' />
    <label for="code" > Code </label>
    <input id='code' name='code' placeholder='Include #...' />
    <div id="form-btns">
      <button type='button' name='test' id='test'>Test</button>
         <button type='button' name='submit' id='submit'>Submit</button>
            <button type='button' name='clear' id='clear'>Clear</button>
    </div>
    `

    form.innerHTML = formHtml

    const testBtn = document.getElementById("test")
    testBtn.addEventListener('click', function () {
      let codeVal = document.getElementById('code').value || alert('empty code')
      formData = {
        code: codeVal
      }
      if (codeVal) {
        renderColorCube(codeVal)
      } else {
        console.error('empty code')
      }
    })

    document.getElementById('code').value || "#333333"
    testBtn.addEventListener('click', function (e) {
      const { id, value } = e.target
      if (id === "test" && value) {
        console.log(value)
      }
    })

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
      const mostRecentColor = data[data.length - 1].code
      renderColorCube(mostRecentColor)
      renderColorList(data)
      renderColorForm()
      colors = data
    } catch (error) { console.error('GET: ', error) }
  }

  /** --------------------- 🗑️ CLEANUP FUNCTIONS --------------------- **/


  /** --------------------- 🚀 INIT APP --------------------- **/

}

window.addEventListener("DOMContentLoaded", init)