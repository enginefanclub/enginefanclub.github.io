const NAVBAR = document.getElementById("navbar")

NAVBAR.innerHTML = `
            <a href="/"><span>home</span></a>
            <a href="/games/"><span>games</span></a>
            <a href="/about/"><span>about</span></a>
            <a href="/user/"><span>user</span></a>
            <a href="/halloween/" class="halloween"><span><div class="icon" style="background-image:url('/assets/site/seasonal/halloween.png');"></div>event</span></a>
`