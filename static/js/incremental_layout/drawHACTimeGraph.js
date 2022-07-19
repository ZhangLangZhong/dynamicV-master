function drawHACTimeGraph(hacNodes){

    // let aaa =
    let socialHac = []

    //arr
    // console.log(hacNodes)

    hacNodes.map(mapItem => {
        if (socialHac.length == 0){
            socialHac.push({index:mapItem.index,List:[mapItem]})
        }else {
            //有相同社区的就添加到当前项
            let socialHacIndex = socialHac.some(item=>{
                if (item.index == mapItem.index){
                    item.List.push(mapItem)
                    return true
                }
            })
            //没找到同一个社区再添加一个对象
            if ( !socialHacIndex){
                socialHac.push({index: mapItem.index, List: [mapItem]})
            }
        }
    })

    // console.log(socialHac)
    // console.log(hacNodes)


    let centerNodes = []

    socialHac.forEach(d=>{
        let HacCenterNode_X = 0
        let HacCenterNode_Y = 0
        // console.log(d)
        // console.log(d.List)
        d.List.forEach(socialNode=>{
            // console.log(socialNode)
            // let
            HacCenterNode_X += socialNode.x
            HacCenterNode_Y += socialNode.y
        })
        let center_x = HacCenterNode_X/d.List.length
        let center_y = HacCenterNode_Y/d.List.length
        value = {"index":d.index,"x":center_x,"y":center_y}
        centerNodes.push(value)
    })

    console.log(centerNodes)






}