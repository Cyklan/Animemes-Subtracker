const ANIMATION_TIME = 1000

let loading = true

const animemesURL = "https://www.reddit.com/r/animemes/about.json"
const goodAnimemesURL = "https://www.reddit.com/r/goodanimemes/about.json"

let subcounts = {
    animemes: 0,
    goodAnimemes: 0
}

function incrementAnimation(oldVal, newVal, elmtId, animationLength) {
    if (oldVal === newVal) return
    const range = newVal - oldVal
    let current = oldVal
    const stepTime = Math.abs(Math.floor(animationLength / range))
    const elmt = document.getElementById(elmtId)
    if (animationLength === 0) {
        elmt.innerHTML = newVal

    } else {
        let timer = setInterval(() => {
            current += newVal > oldVal ? 1 : -1
            elmt.innerHTML = current
            if (current === newVal) {
                clearInterval(timer)
            }
        }, stepTime)
    }
}

async function update() {
    const animemes = getUpdate(animemesURL)
    const goodAnimemes = getUpdate(goodAnimemesURL)

    await Promise.all([animemes, goodAnimemes]).then(values => {
        incrementAnimation(subcounts.animemes, values[0].subs, "subcount-left", loading ? 0 : ANIMATION_TIME)
        incrementAnimation(subcounts.goodAnimemes, values[1].subs, "subcount-right", loading ? 0 : ANIMATION_TIME)
        subcounts.animemes = values[0].subs
        subcounts.goodAnimemes = values[1].subs
        console.log(subcounts)
        if (loading) {
            loading = false
            document.getElementById("loading").style.display = "none"
            document.getElementById("container").style.display = "flex"
            document.getElementById("sub-icon-left").src = values[0].icon
            document.getElementById("sub-icon-right").src = values[1].icon
        }
    })
}

function getUpdate(url) {
    return fetch(url)
        .then(res => res.json())
        .then(res => { return { icon: res.data.icon_img, subs: res.data.subscribers } })
}

update()
setInterval(update, 2000)