function init_edit() {


    document.querySelector("#dark-mode-toggle").addEventListener('change',
        function() {
            if(this.checked)
                document.body.classList.add("dark-theme")
            else
                document.body.classList.remove('dark-theme')
        });
}