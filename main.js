/**
 * enchant();
 * Preparation for using enchant.js.
 * (Exporting enchant.js class to global namespace.
 *  ex. enchant.Sprite -> Sprite etc..)
 *
 * enchant.js を使う前に必要な処理。
 * (enchant.js 本体や、読み込んだプラグインの中で定義されている enchant.Foo, enchant.Plugin.Bar などのクラスを、
 *  それぞれグローバルの Foo, Bar にエクスポートする。)
 */
enchant();

/*
 * window.onload
 *
 * The function which will be executed after loading page.
 * Command in enchant.js such as "new Core();" will cause an error if executed before entire page is loaded.
 *
 * ページがロードされた際に実行される関数。
 * すべての処理はページがロードされてから行うため、 window.onload の中で実行する。
 * 特に new Core(); は、<body> タグが存在しないとエラーになるので注意。
 */
window.onload = function(){
    /**
     * new Core(width, height)
     *
     * Make instance of enchant.Core class. Set window size to 320 x 320
     * Core オブジェクトを作成する。
     * 画面の大きさは 320ピクセル x 320ピクセル に設定する。
     */
    var game = new Core(1080, 640);

    /**
     * Core.fps
     *
     * Set fps (frame per second) in this game to 15.
     * ゲームの fps (frame per second) を指定する。この場合、1秒間あたり15回画面が更新される。
     */
    game.fps = 15;
    /**
     * Core#preload
     *
     * You can preload all assets files before starting the game.
     * Set needed file lists in relative/absolute path for attributes of Core#preload
     * 必要なファイルを相対パスで引数に指定する。 ファイルはすべて、ゲームが始まる前にロードされる。
     */
     game.preload("title_logo.png");
     game.preload("kame_admin.png");
     game.preload("start_button.png");
     game.preload("score_label.png");
     game.preload("belt_conveyor.png");
     game.preload("organize_button.png");


    /**
     * Core#onload
     *
     * ロードが完了した直後に実行される関数を指定している。
     * onload プロパティは load イベントのリスナとして働くので、以下の2つの書き方は同じ意味。
     *
     * game.onload = function(){
     *     // code
     * }
     *
     * game.addEventListener("load", function(){
     *     // code
     * })
     */
    game.onload = function(){
        /**
         * new Sprite(width, height)
         * スプライトオブジェクトを作成する。
         * Sprite は、Entity, Node, EventTarget を継承しており、それぞれのメソッドやプロパティを使うことができる。
         */
        title_logo = new Sprite(700, 90);
        kame_admin = new Sprite(960, 640);
        start_button = new Sprite(200, 70);
        score_label = new Sprite(200, 70);
        belt_conveyor = new Sprite(1200, 400);  
        organize_button = new Sprite(330, 70);

        var scoreUpSquare = new Sprite(100, 640);
        var surf = new Surface(100, 640);
        surf.context.beginPath();
        surf.context.fillStyle = 'rgba(0, 0, 252, 0.5)';
        surf.context.fillRect(0, 0, 100, 560);
        scoreUpSquare.moveTo(500, 0);
        scoreUpSquare.image = surf;

        var scoreDownSquareFirst = new Sprite(100, 640);
        var surf = new Surface(100, 640);
        surf.context.beginPath();
        surf.context.fillStyle = 'rgba(252, 0, 0, 0.5)';
        surf.context.fillRect(0, 0, 70, 560);
        scoreDownSquareFirst.moveTo(400, 0);
        scoreDownSquareFirst.image = surf;

        var scoreDownSquareSecond = new Sprite(100, 640);
        var surf = new Surface(100, 640);
        surf.context.beginPath();
        surf.context.fillStyle = 'rgba(252, 0, 0, 0.5)';
        surf.context.fillRect(0, 0, 70, 560);
        scoreDownSquareSecond.moveTo(650, 0);
        scoreDownSquareSecond.image = surf;


        /**
         * Sprite.image {Object}
         * Core#preload で指定されたファイルは、Core.assets のプロパティとして格納される。
         * Sprite.image にこれを代入することで、画像を表示することができる
         */
        title_logo.image = game.assets["title_logo.png"];
        kame_admin.image = game.assets["kame_admin.png"];
        start_button.image = game.assets["start_button.png"];
        score_label.image = game.assets["score_label.png"];  
        belt_conveyor.image = game.assets["belt_conveyor.png"];
        organize_button.image = game.assets["organize_button.png"];
        // ラベルを作成
        var score = 0;
        var myLabel = new Label(String(score));
        myLabel.font = "36px Palatino";
        myLabel.x = 250; // X座標
        myLabel.y = 20;  // Y座標

        /**
         * Node.x Node.y {Number}
         * x, y 座標を指定する。
         * viewport の大きさに合わせて画面が拡大縮小されている場合も、
         * オリジナルの座標系で指定できる。
         */
        title_logo.x = 120;
        title_logo.y = 30;
        kame_admin.x = 80;
        kame_admin.y = 0;
        start_button.x = 400;
        start_button.y = 300;
        startAnimScaleUp = true;
        score_label.x = 30;
        score_label.y = 0;
        belt_conveyor.y = 160;
        organize_button.x = 720;
        organize_button.y = 20;


        start_button.onenterframe = function() {
            if ( startAnimScaleUp ) {
                this.scaleX += 0.1;
                this.scaleY += 0.1;
            } else {
                this.scaleX -= 0.1;
                this.scaleY -= 0.1;
            }

            if (this.scaleX > 2.0) {
                startAnimScaleUp = false;
            } else if (this.scaleX < 0.9) {
                startAnimScaleUp = true;
            }
        };


        /**
         * Group#addChild(node) {Function}
         * オブジェクトをノードツリーに追加するメソッド。
         * ここでは、クマの画像を表示するスプライトオブジェクトを、rootScene に追加している。
         * Core.rootScene は Group を継承した Scene クラスのインスタンスで、描画ツリーのルートになる特別な Scene オブジェクト。
         * この rootScene に描画したいオブジェクトを子として追加する (addChild) ことで、毎フレーム描画されるようになる。
         * 引数には enchant.Node を継承したクラス (Entity, Group, Scene, Label, Sprite..) を指定する。
         */
         game.rootScene.addChild(title_logo);
         game.rootScene.addChild(kame_admin);
         game.rootScene.addChild(start_button);
 
        /**
         * EventTarget#addEventListener(event, listener)
         * イベントに対するリスナを登録する。
         * リスナとして登録された関数は、指定されたイベントの発行時に実行される。
         * よく使うイベントには、以下のようなものがある。
         * - "touchstart" : タッチ/クリックされたとき
         * - "touchmove" : タッチ座標が動いた/ドラッグされたとき
         * - "touchend" : タッチ/クリックが離されたとき
         * - "enterframe" : 新しいフレームが描画される前
         * - "exitframe" : 新しいフレームが描画された後
         * enchant.js やプラグインに組み込まれたイベントは、それぞれのタイミングで自動で発行されるが、
         * EventTarget#dispatchEvent で任意のイベントを発行することもできる。
         *
         */
       /* bear.addEventListener("enterframe", function(){
            /**
             * x座標をインクリメントしている。
             * この無名関数 function(){ ... } は enterframe イベントのリスナなので、毎フレーム実行される。
             */
            //this.x += 1;

//         });
        /**
         * タッチされると消える処理を実現するために、
         * touchstart イベントが起こったとき、タイトルロゴとボタンが消える処理をリスナとして追加する。
         */
        var keys = new Array();
        var trashs = new Array();
        var keyOkCnt = 0;
        var keyNgCnt = 0;
        var trashOkCnt = 0;
        var trashNgCnt = 0;

        start_button.addEventListener("touchstart", function(){
            game.rootScene.removeChild(title_logo);
            game.rootScene.removeChild(start_button);
            game.rootScene.addChild(score_label);
            // ラベルやベルトコンベアなどゲーム用のオブジェクトを画面に表示
            game.rootScene.addChild(myLabel);
            game.rootScene.addChild(belt_conveyor);
            game.rootScene.addChild(organize_button);
            game.rootScene.addChild(scoreUpSquare);
            game.rootScene.addChild(scoreDownSquareFirst);
            game.rootScene.addChild(scoreDownSquareSecond);
            // 鍵の一覧を作る
            var i ;
            for( i = 0 ; i < 20 ; i++ ) {
                // Spriteを作成する
                keys[ i ] = new Sprite( 64, 64);
                keys[ i ].image = game.assets["title_logo.png"];
                keys[ i ].x = 0 - (i * 500);
                keys[ i ].y = 350;

                // Spriteを作成する
                trashs[ i ] = new Sprite( 64, 64);
                trashs[ i ].image = game.assets["score_label.png"];
                trashs[ i ].x = 0 - (i * 500);
                trashs[ i ].y = 350;

                game.rootScene.addChild(keys[ i ]); 
                // フレームイベントが発生したら処理
                keys[i].addEventListener( Event.ENTER_FRAME, function(){
                    if (this.y == 350 ) {
                        this.x =  this.x + 12;
                    }
                });
 

                game.rootScene.addChild(trashs[ i ]); 
                // フレームイベントが発生したら処理
                trashs[ i ].addEventListener( Event.ENTER_FRAME, function(){
                    if (this.y == 350 ) {
                        this.x =  this.x + 11;
                    }
                });
            }
        });
        // 整理ボタンを押して、スコアをアップする。　時間が間に合ったら当たり判定を入れる

        organize_button.addEventListener("touchstart", function(){
            for( i = 0 ; i < 20 ; i++ ){
                if (keys[i].x > 500 && keys[i].x < 600 && keys[i].y == 350) {
                    score += 1;   
                    keys[i].x = ((keyOkCnt % 5) * 40);
                    keys[i].y = 100 + (Math.floor(keyOkCnt / 5) * 70);
                    keyOkCnt += 1;
                } else if (((keys[i].x > 400 && keys[i].x < 450) || (keys[i].x > 650 && keys[i].x < 700) )&& trashs[i].y == 350) {
                    score -= 1;   
                    keys[i].x = 700 + ((keyNgCnt % 5) * 40);
                    keys[i].y = 100 + (Math.floor(keyNgCnt / 5) * 70);
                    keyNgCnt += 1;
                } 

                if (trashs[i].x > 500 && trashs[i].x < 600 && trashs[i].y == 350) {
                    score -= 1;   
                    trashs[i].x = 200 + ((trashNgCnt % 5) * 40);
                    trashs[i].y = 100 + (Math.floor(trashNgCnt / 5) * 70);
                    trashNgCnt += 1;
                } else if (((trashs[i].x > 400 && trashs[i].x < 470) || (trashs[i].x > 650 && trashs[i].x < 720) )&& trashs[i].y == 350) {
                    score += 1;   
                    trashs[i].x = 900 + ((trashOkCnt % 5) * 40);
                    trashs[i].y = 100 + (Math.floor(trashOkCnt / 5) * 70);
                    trashOkCnt += 1;
                }                 
            }
        });
        // 
        myLabel.addEventListener(Event.ENTER_FRAME, function(){
             this.text = String(score);
        });        
    };


    /**
     * Core#start
     * ゲームを開始する。この関数を実行するまで、ゲームは待機状態となる。
     * 代わりに Core#debug を使うことで、デバッグモードで起動することができる。
     * Core#pause(); で一時停止し、 Core#resume(); で再開することができる。
     */
    game.start();
};
