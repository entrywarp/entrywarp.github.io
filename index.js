document.addEventListener("readystatechange", function(documentLoadEvent) {
    if (document.readyState == "complete") {
        const currentURL = new URL(window.location.href);
        let projectId = "621ae1b0cf6580007a72ec37";
        if (currentURL.searchParams.has("id")) {
            projectId = currentURL.searchParams.get("id");
        }

        console.log("작품 불러오기 중...");
        console.log(`https://playentry.org/project/${projectId}`);

        const scriptSrc = `https://entrywarp.vercel.app/api/compileresult?projectid=${projectId}`;
        const scriptElem = document.createElement("script");
        scriptElem.src = scriptSrc;
        document.body.appendChild(scriptElem);

        scriptElem.addEventListener("load", function(scriptLoadEvent) {
            console.log("작품을 성공적으로 불러왔습니다.");
            const program = new CurrentProgram();

            const runButton = document.createElement("button");
            runButton.addEventListener("click", function(runButtonClickEvent) {
                program.fullStart();
            });
            runButton.textContent = "실행하기";

            document.body.appendChild(runButton);
        });

        scriptElem.addEventListener("error", function(scriptErrorEvent) {
            console.log("작품 불러오기/컴파일 과정에서 문제가 발생했습니다.");
        });
    }
});
