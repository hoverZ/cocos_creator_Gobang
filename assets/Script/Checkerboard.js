cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.lineNum = 15;
        this.pieceSideLength = this.node.width / 16;
        this.sideLength = this.pieceSideLength * 14;
        this.validateAraeSide = this.pieceSideLength * 15;
        this.leftDownPosition = {
            x: this.pieceSideLength,
            y: this.pieceSideLength
        }
        
        // this.ctx = this.getComponent(cc.Graphics)
        // if( !this.ctx ){
        //     this.ctx = this.addComponent(cc.Graphics)
        // }
        // this.ctx.moveTo(0,0);
        // this.ctx.lineTo(300,150);
        // this.ctx.stroke();
        // this.drawNode = new cc.DrawNode();
        // this.drawNode.drawSegment(cc.p(0, 0), cc.p(200,300), 1, cc.color(255, 0, 255, 255));
        // this.drawNode.drawSegment(cc.p(20, 0), cc.p(200,300), 1, cc.color(255, 0, 255, 255));
        // cc.Canvas.instance.node.parent._sgNode.addChild(this.drawNode)
        // console.log(ctx)
    },

    getPiecePosition( x, y){
        let row, col;
        let px, py;
        px = x - this.startX - this.pieceSideLength / 2;
        py = y - this.startY - this.pieceSideLength / 2;

        // 棋子不在有效区域内
        if( px < 0 || px > this.validateAraeSide || py < 0 || py > this.validateAraeSide){
            return false;
        }
        row = Math.floor( py / this.pieceSideLength );
        col = Math.floor( px / this.pieceSideLength );
        return {
            row: row,
            col: col,
            px: this.startX + (col+1) * this.pieceSideLength,
            py: this.startY + (row+1) * this.pieceSideLength
        }
    },

     // 检查是否结束游戏
     checkWin( gameData, row, col){
        let max = 0;
        let length = 0;
        for (let type = 1; type <= 4; type++) {
            length = this.checkIndexPiece(row, col, gameData, type)
            if( length > max){
                max = length
            }
        }
        if( max >= 5){
            return true
        }else{
            return false
        }
    },

    // 以下的棋子检查 4 个方向
    checkIndexPiece( row, col, gameData, type){
        let addRow, addCol
        let startRow = row ,startCol = col
        switch(type){
            case 1: // 横向：左到右
                addRow = 0
                addCol = 1
                startCol -= 4
                break
            case 2: // 左上：由左向右
                addRow = 1
                addCol = 1
                startRow -= 4
                startCol -= 4
                break
            case 3: // 竖向：由上向下
                addRow = 1
                addCol = 0
                startRow -= 4
                break
            case 4: // 左下：由左向右
                addRow = -1
                addCol = 1
                startRow += 4
                startCol -= 4
                break
            default:
                return 0
        }
        let player = gameData[row][col]
        let max = 0
        let tmp = 0
        
        for(let index = 0 ; index < 9; index ++){
            // 线上中断，判断最大长度与临时长度，谁长就赋值给 max
            if( startRow < 0 || startCol < 0 || startRow > 14 || startCol > 14 
                || gameData[startRow][startCol] != player){
                max = max > tmp ? max : tmp
                tmp = 0
                
                startRow += addRow
                startCol += addCol
                
                continue
            }
            tmp ++
            startRow += addRow
            startCol += addCol
            
        }
        max = max > tmp ? max : tmp
        return max
    },

    start () {

    },

    // update (dt) {},
});
