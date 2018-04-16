// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        pieceblackPrefab: {
            default: null,
            type: cc.Prefab
        },
        piecewithePrefab: {
            default: null,
            type: cc.Prefab
        },
        checkerboard: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.checkerboard.getComponent('Checkerboard').startX = (this.node.width - this.checkerboard.getComponent('Checkerboard').node.width)/ 2;
        this.checkerboard.getComponent('Checkerboard').startY = (this.node.height - this.checkerboard.getComponent('Checkerboard').node.height)/ 2;
        this.player = 0;
        this.gameOver = false;
        this.gameData = [];
    },

    renderLine (){
        this.drawNode = new cc.DrawNode();
        // console.log(this.checkerboard.getComponent('Checkerboard').leftDownPosition);
        let startX = this.checkerboard.getComponent('Checkerboard').startX + this.checkerboard.getComponent('Checkerboard').leftDownPosition.x ;
        let startY = this.checkerboard.getComponent('Checkerboard').startY + this.checkerboard.getComponent('Checkerboard').leftDownPosition.y ;
        let sideLength = this.checkerboard.getComponent('Checkerboard').sideLength;
        let pieceSideLength = this.checkerboard.getComponent('Checkerboard').pieceSideLength;
        let tmpY, tmpX;
        // 画横线
        for (let line = 0; line < 15; line++) {
            tmpY = startY + line * pieceSideLength;
            this.drawNode.drawSegment(cc.p(startX, tmpY), cc.p(startX + sideLength,tmpY), 1, cc.color(0, 0, 0, 255));
        }
        for (let line = 0; line < 15; line++) {
            tmpX = startX + line * pieceSideLength;
            this.drawNode.drawSegment(cc.p(tmpX, startY), cc.p(tmpX,startY+ sideLength), 1, cc.color(0, 0, 0, 255));
        }
        cc.Canvas.instance.node.parent._sgNode.addChild(this.drawNode)
    },

    clearGameData(){
        for(let row = 0; row < 15 ; row ++){
            this.gameData[row] = []
            for (let col = 0; col < 15; col++) {
                this.gameData[row][col] = 0;
            }
        }
    },

    start () {
        this.clearGameData();
        this.renderLine();
        this.node.on( 'touchstart', (event) => {
            let position = this.checkerboard.getComponent('Checkerboard').getPiecePosition(event.touch._point.x, event.touch._point.y);
            if( position === false){
                console.log("不在棋盘范围内");
                return
            }
            if( this.gameData[position.row][position.col] !== 0){
                console.log("改地方已存在棋子");
                return
            }
            let newPiece = this.player === 0 ? cc.instantiate(this.pieceblackPrefab):cc.instantiate(this.piecewithePrefab);
            console.log(newPiece);
            // // 将新增的节点添加到 Canvas 节点下面
            var scene = cc.director.getScene();
            // this.node.addChild(newPiece);
            // // 为星星设置一个随机位置
            newPiece.parent = scene;
            console.log(position);
            newPiece.setPosition(cc.p(position.px, position.py));
            this.gameData[position.row][position.col] = this.player + 1;
            
            if( this.checkerboard.getComponent("Checkerboard").checkWin(this.gameData, position.row, position.col) ){
                let winner = this.player === 0 ? "黑棋" : "白棋";
                console.log(winner + " WIN ");
            }
            this.player = (this.player+1) % 2;
        });
    },

    // update (dt) {},
});
