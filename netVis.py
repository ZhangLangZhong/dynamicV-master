# coding=utf-8
import json
import os
import math
import random
from ctypes import Array

from typing import Any, List


import matplotlib.pyplot as plt
import pylab
# import Array
import calNetwork
from flask import Flask, request
from flask import render_template, jsonify
from jgraph import *
import re
import datetime
import pandas as pd
from glom import glom
import numpy as np

upload_file_index = 0
upload_path = ''  # 保存每次上传数据后的地址，保证上传后 文件不会丢失



app = Flask(__name__)


# 计算布局数据
def cal_back_layout_data(result, layout_type):
    if layout_type == 'force' or layout_type == 'bundle' or layout_type == 'incremental':
        return False
    # print 99999
    # 后面的没有执行了
    # nodes = []
    # links = []
    # for node in result['nodes']:
    #     nodes.append(node['id'])
    # for link in result['links']:
    #     source = nodes.index(link['source'])
    #     target = nodes.index(link['target'])
    #     links.append((source, target))
    #
    # graph = Graph()
    # graph.add_vertices(len(nodes))
    # # print len(nodes)
    # graph.add_edges(links)
    # lay = graph.layout(layout_type)
    #
    # for node in result['nodes']:
    #     for i, row in enumerate(lay):
    #         if nodes[i] == node['id']:
    #             node['x'] = row[0]
    #             node['y'] = row[1]
    #             break
    #
    # for link in result['links']:
    #     for node in result['nodes']:
    #         if link['source'] == node['id']:
    #             link['x1'] = node['x']
    #             link['y1'] = node['y']
    #         if link['target'] == node['id']:
    #             link['x2'] = node['x']
    #             link['y2'] = node['y']


@app.route('/')
def index():
    return render_template('index.html')



# 没有他能不能加载 能加载 但是没有那个跑起来的按钮了
# 初始化数据
@app.route('/initial')
def get_initial_data():
    try:  # try ... catch
        with open('files/jsonFormat/time-line.json') as fi:
            result = json.load(fi)
            # print result
            # {'packages': [{'date': '2015-4-23 16:45', 'value': '1'}, {'date': '2015-4-23 16:50', 'val...
            # print jsonify(result)
            return jsonify(result)
    except:
        # print 'error'
        return jsonify({})


#
# # 返回布局数据
# @app.route('/layout')
# def get_back_layout_data():
#     layout_type = request.args.get('layout_type')
#     global upload_path
#     try:
#         if upload_path:
#             with open(upload_path) as fi:
#                 result = json.load(fi)
#                 cal_back_layout_data(result, layout_type)
#                 calNetwork.cal_characters_arguments(result)
#                 return jsonify(result)
#         else:
#             with open('files/jsonFormat/small-443nodes-476edges.json') as fi:
#                 result = json.load(fi)
#                 cal_back_layout_data(result, layout_type)
#                 calNetwork.cal_characters_arguments(result)
#                 return jsonify(result)
#     except:
#         print 'error'
#         return jsonify({})


# 刷取数据


# hash表








g_b = 0

@app.route('/brush_extent')
def get_brush_extent_data():
    # start = datetime.datetime.now()
    # print(start,"111")
    # print start , "111"
    # 标记时间的起始节点
    flag = False
    # 记录节点id
    nodes = []
    # 记录边id
    links = []
    result = {'nodes': [], 'links': []}
    # print result
    start_time = request.args.get('start')
    # print start_time
    # 2015-04-23 16:45
    end_time = request.args.get('end')
    # end_time

    layout_type = request.args.get('layout_type')


    # print layout_type
    # incremental
    path = 'files/jsonFormat/packages/'
    files = os.listdir(path)

    # df = pd.read_json
    # print files
    # ['2015-04-23 16_45.json', '2015-04-23 16_50.json',.....
    # start = datetime.datetime.now()
    # print start , "111"
    # pathTime = 'files/jsonFormat/'
    # jsonPathTime = os.listdir(pathTime)
    # with open
    # fTime = open('files/jsonFormat/timeN.json')
    # fTimetime = json.load(fTime)
    # fNumber = fTimetime['time']
    # fNumber = fNumber + 1
    #
    # json_info = {"time":fNumber}
    #
    # json.dumps(json_info,'files/jsonFormat/timeN.json')
    #
    # print fNumber

    # global g_b
    # print files[g_b]

    global g_b

    global souTar

    date = re.match(r"(\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}_\d{1,2})", files[g_b])
    if date:
        # print(999999999999999)
        # print(date)
        # global g_b

        time = files[g_b].replace('.json', '')
        time = time.replace('_', ':')

        # global g_b
        if time == start_time:
            flag = not flag
        if time == end_time:
            flag = not flag
        if flag:

            json_data = pd.read_json(path + files[g_b])

            # print(9999999)
            # print(json_data)
            # print(df)


            # with open(path + files[g_b]) as fi:

            # print(fi)
            # print fi
            # files/jsonFormat/packages/2015-04-30 23_55.json
            # json_data = json.load(fi)
            # print(json_data)
            # print json_data['nodes']

            # print json_data

            # hashNode = dict()
            # for node in json_data['nodes']:
            # hashNode[node['id']] = node['id']
            #
            # print hashNode

            # print result['nodes']


            # dataNode = json_data['nodes'].apply(lambda row:glom(row,'id'))
            # # print(dataNode)
            # for i in range(0,len(dataNode) - 1):
            #     print(i)
            #     value = {'id':i}
            #     result['nodes'].append(value)
            #     # nodes.append(i)
            #     # result


            # for node in json_data['nodes']:
            #     if node['id'] not in nodes:
            #         print(node)
            #         # print(node['id'])
            #         result['nodes'].append(node)
            #         nodes.append(node['id'])

                        # print result['nodes']

                    # else:
                    #
                    #     # print result['nodes']
                    #     # print node['id']
                    #     # print result['nodes']
                    #     for re_node in result['nodes']:
                    #         print re_node
                    #         # print re_node['id']
                    #         if re_node['id'] == node['id']:
                    #             result['nodes'].remove(re_node)
                    #             result['nodes'].append(node)
                    #             break

            dataSource = json_data['links'].apply(lambda row:glom(row,'source'))
            dataTarget = json_data['links'].apply(lambda row:glom(row,'target'))
            # print(999999999999)
            # print(json_data)
            # print(dataSource)
            for i in range(0,len(dataSource)):
                value = {"source":dataSource[i],"target":dataTarget[i]}
                result['links'].append(value)

            # print(result)

            souTar =  result['links']

                # value = {'source':}
                # print(i)




            # for link in json_data['links']:
            #     # print(link)
            #     if link['id'] not in links:
            #         # print(link)
            #         # print(link['id'])
            #         result['links'].append(link)
            #         links.append(link['id'])
                    # else:
                    #     for re_link in result['links']:
                    #         if re_link['id'] == link['id']:
                    #             result['links'].remove(re_link)
                    #             result['links'].append(link)
                    #             break

    # global g_b
    g_b = g_b + 1

    # print g_b



    # n = 0
    # n = n + 1
    # print n
    # for f in files:
    #     # n = n+1
    #     # print f
    #
    #     # print n
    #
    #     # 排除非标准格式的文件名
    #     date = re.match(r"(\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}_\d{1,2})", f)
    #
    #     # print date
    #     # print f
    #     if date:
    #         time = f.replace('.json', '')
    #         # print time
    #         time = time.replace('_', ':')
    #         # 把格式转换成 2015-04-23 17：50 这样子
    #
    #         # print time
    #
    #         if time == start_time:
    #             flag = not flag
    #         if time == end_time:
    #             flag = not flag
    #         # print flag
    #         # 得到True 和 False false的话就继续
    #         # print path+f
    #         if flag:
    #             with open(path + f) as fi:
    #
    #                 # print fi
    #                 # files/jsonFormat/packages/2015-04-30 23_55.json
    #                 json_data = json.load(fi)
    #
    #                 # print json_data['nodes']
    #
    #                 # print json_data
    #                 for node in json_data['nodes']:
    #                     # print json_data['nodes']
    #                     # print node['id'] not in nodes
    #                     if node['id'] not in nodes:
    #                         result['nodes'].append(node)
    #                         nodes.append(node['id'])
    #                     else:
    #                         for re_node in result['nodes']:
    #                             if re_node['id'] == node['id']:
    #                                 result['nodes'].remove(re_node)
    #                                 result['nodes'].append(node)
    #                                 break
    #
    #
    #
    #                 for link in json_data['links']:
    #                     if link['id'] not in links:
    #                         result['links'].append(link)
    #                         links.append(link['id'])
    #                     else:
    #                         for re_link in result['links']:
    #                             if re_link['id'] == link['id']:
    #                                 result['links'].remove(re_link)
    #                                 result['links'].append(link)
    #                                 break

    # end = datetime.datetime.now()
    # print(end,"222")
    # print end , "222"


    # print nodes
    # print links
    # print result
    # {'nodes': [{'opacity': '0.86', 'level': '7', 'color': '#C4C9CF', 'continuous': '1',
    # print result
    # cal_back_layout_data(result, layout_type)
    # calNetwork.cal_characters_arguments(result)
    # print jsonify(result)
    # print result
    # print start_time
    # end = datetime.datetime.now()
    # print end , "222"

    # print jsonify(result)

    return jsonify(result)




# 接收点的坐标属性 返回HAC聚类后的group信息
@app.route('/element_position')
def HAC_CLUSTRING():


    mergeRatio = 0.002
    #社区数量
    clusterCenterNumber = 14


    # print(999999999999)
    layoutNodesInformation = request.args.get('nodeInformation')
    # print("888888888888888888888")
    # print(layoutNodesInformation)
    # print(type(layoutNodesInformation))

    # nodeJson = json.loads(layoutNodesInformation)
    # print(nodeJson)
    # print(type(nodeJson))

    jsonNodeData = pd.read_json(layoutNodesInformation,orient='records')
    # print(jsonNodeData)

    allNodes = {"nodes":[],"links":[]}

    node_id = jsonNodeData["id"]
    # print(node_id)
    node_x = jsonNodeData["x"]
    node_y = jsonNodeData["y"]
    node_degree = jsonNodeData["degree"]
    # print(jsonNodeData)
    # print(node_x)
    # print(node_degree)
    # print(node_y)
    numberTemp = 0
    for i in range(0,len(jsonNodeData)):
        value = {"id":node_id[i],"x":node_x[i],"y":node_y[i],"group":node_id[i],'index':numberTemp,'degree':node_degree[i],'status':-1}
        numberTemp = numberTemp + 1
        # print(value)
        allNodes["nodes"].append(value)

    # print(allNodes['nodes'])
    # print(888888888888)
    # print(allNodes)
    # print(jsonNodeData)
    #
    # print(len(jsonNodeData))
    # node_id = jsonNodeData['id'].apply(lambda row:glom(row))
    # node_x = jsonNodeData['x'].apply(lambda row:glom(row))
    # for index in range(0,len(jsonNodeData)):
    # for index in enumerate(jsonNodeData):
    #     # print(9999999)
    #     # value = {"id":}
    #     print(index)
        # print(index)
        # value = {"id":jsonNodeData[index].id}
        # print(value)
    # for index in nodeJson:
    #     # tempNode = json.load(index)
    #     print(index)
    #     # print(tempNode.id)
    #     # point.group = index.id
    # print(allNodes)
    # print(allNodes['nodes'][0]['id'])
    # 分成几个类


    # clusterCenterNumber = 14
    pointsNumber = len(node_id)
    tarSouNumber = len(souTar)

    distanceMap = {}

    # print(allNodes['nodes'])

    # print(souTar[0]['source'])

    # source 的ID数
    # sourceIndex = int(souTar[0]['source'])

    # hash(sourceIndex)

    # print(allNodes['nodes'][sourceIndex])


    # print(allNodes['nodes'])

    # 点集（包含x y信息的）的哈希表
    # node_hash = HashTable()
    # for i in allNodes['nodes']:
    #     # print(i)
    #     # print(i['id'])
    #     nodeSingle = HashNode(int(i['id']),i)
    #     # print(nodeSingle)
    #     node_hash.add(nodeSingle)
    #     # node_hash.add(i['id'],i)
    #
    # print(node_hash.list())
    # print(int(souTar[0]['source']))
    # print(node_hash.find(int(souTar[0]['source']))['x'])
    # print(node_hash.find(int(souTar[0]['source'])))

    # print(allNodes)

    # 所有node的索引哈希表 通过id就能索引到value的信息
    node_hash = HashTable()
    hashTemp = node_hash
    for i in allNodes["nodes"]:
        # print(i)
        # print(i['id'])
        # print(type(i['id']))
        # nodeSingle = HashNode(i["id"],i)
        # print(type(nodeSingle))
        # print(nodeSingle)
        node_hash.put(i["id"],i)
        # nodeSingle = {}
        # print(node_hash)
        # print(type(node_hash))
        hashTemp = node_hash
        # print(99999999999999999999999999999999)
        # node_hash.add(i['id'],i)

    # print(hashTemp.find(167).data)
    # print(hashTemp.find(167).data['id'])

    distanceMap = {}

    # print(souTar)
    # print(hashTemp.list())
    # print(hashTemp.find(167))
    # print(hashTemp.find(300))
    # print(hashTemp.find(400))
    # print(9999999)
    #
    # print(hashTemp.get(300))
    # print(hashTemp.get(400))


    # print(souTar) 数据边的tar sou对
    for i in souTar:
        # print(i['source'])  摘出来那个数source的具体值
        # print(i['source'])
        # print(type(i['source']))
        # print(hashTemp.find(607))
        # print(hashTemp.find(int(i['source'])))

        # print(hashTemp.get(int(i['source'])))
        # print(9999999999)
        # source那个点的x坐标
        # print(i)
        # print(hashTemp.get(607))
        # print(hashTemp.get(607)['x'])

        linkSource = int(i['source'])
        linkTarget = int(i['target'])

        # 如果targer的degree比source更大 那就交换二者 比如555degree为3  666degreee为6 555到666中
        if hashTemp.get(int(i['target']))['degree'] > hashTemp.get(int(i['source']))['degree']:
            temp = linkSource
            linkSource = linkTarget
            linkTarget = temp

        souX = hashTemp.get(linkSource)['x']
        # print(souX)
        souY = hashTemp.get(linkSource)['y']
        tarX = hashTemp.get(linkTarget)['x']
        tarY = hashTemp.get(linkTarget)['y']

        # print()
        nodesDistance = (souX - tarX) * (souX - tarX) + (souY - tarY) * (souY - tarY)

        # print(nodesDistance)
        # print(99999999999)
        # print(hashTemp.get(int(i['source']))['id'])

        # print(distanceMap)
        # 让节点越多的节点越容易先占坑
        distanceMap[str(hashTemp.get(linkSource)['id']) + '#' + str(hashTemp.get(linkTarget)['id'])] = nodesDistance/hashTemp.get(linkTarget)['degree']

    distanceMap = sorted(distanceMap.items(), key=lambda dist: dist[1], reverse=False)

    # 谁到谁有多远  小窗口几十到两三百的多
    print(distanceMap)

    # for key, _ in distanceMap:
    #     lowIndex, highIndex = int(key.split('#')[0]), int(key.split('#')[1])
    #     print(hashTemp.get(lowIndex))
    #     value = {"id":hashTemp.get(lowIndex)['id'],"x":hashTemp.get(lowIndex)['x'],'group':hashTemp.get(lowIndex)['group',]}

    unsortedGroup = {index:1 for index in range(len(allNodes['nodes']))}

    # print(hashTemp.size())



    # print(unsortedGroup)


    # nodesHash = HashTable
    #
    # numberIndex = 0
    # for key, _ in distanceMap:
    #     lowIndex, highIndex = int(key.split('#')[0]), int(key.split('#')[1])
    #     valueLow = {"id":lowIndex,"x":hashTemp.get(lowIndex)['x'],"y":hashTemp.get(lowIndex)['x'],"group":lowIndex,'index':numberIndex}
    #     print(valueLow)
    #     print(lowIndex)
    #     nodesHash.put(lowIndex,valueLow)
    #     numberIndex = numberIndex + 1
    #     valueHigh = {"id": highIndex, "x": hashTemp.get(highIndex)['x'], "y": hashTemp.get(highIndex)['x'], "group": highIndex,'index': numberIndex}
    #     nodesHash.put(highIndex,valueHigh)
    #
    # print(nodesHash.hash())


    # numberGroup = -1


    # a = -99999
    # print(a)
    # print(abs(a))

    for key,_ in distanceMap:
        # print(key)        谁到谁
        # print(_)          有多远
        # print(_)
        # print(unsortedGroup)
        lowIndex, highIndex = int(key.split('#')[0]), int(key.split('#')[1])
        # print(9999999999999999)
        # print(hashTemp.get(lowIndex)['index'])
        # print(hashTemp.get(highIndex)['index'])

        if hashTemp.get(lowIndex)['index'] != hashTemp.get(highIndex)['index']:

            lowGroupIndex = hashTemp.get(lowIndex)['index']
            highGroupIndex = hashTemp.get(highIndex)['index']
            # print(lowIndex)
            # print(highIndex)
            # print(lowGroupIndex)
            # print(unsortedGroup[lowGroupIndex])
            # print(unsortedGroup[highGroupIndex])
            # print(unsortedGroup[lowGroupIndex])
            # unsortedGroup.has
            # print(unsortedGroup.get(lowGroupIndex))
            # print(unsortedGroup)
            # print(lowGroupIndex)
            # print(unsortedGroup.get(lowGroupIndex))


            '''版本粗'''
            # if (unsortedGroup.get(lowGroupIndex) != None and unsortedGroup.get(highGroupIndex) != None):
            #     unsortedGroup[lowGroupIndex] = unsortedGroup[highGroupIndex] + unsortedGroup[lowGroupIndex]
            # if unsortedGroup.get(highGroupIndex) != None:
            #     del unsortedGroup[highGroupIndex]
            # hashTemp.get(highIndex)['index'] = abs(lowGroupIndex)
            #
            # # ********情况2 high是大哥   398#577  应该变化的是398的index 变为577的
            # if(unsortedGroup.get(highGroupIndex) != None):
            #     if(unsortedGroup[highGroupIndex] > 1):
            #         hashTemp.get(lowIndex)['index'] = abs(highGroupIndex)
            #         continue
            #
            #     # **********情况3 双大哥  577#499  在碰面之前 577和499都加入了社区
            #     # if (lowGroupIndex > 0 and highGroupIndex > 0)
            #
            # if (unsortedGroup.get(highGroupIndex) != None and unsortedGroup.get(lowGroupIndex) != None):
            #     if (unsortedGroup[highGroupIndex] > 1 and unsortedGroup[lowGroupIndex] > 1):
            #         continue
            #
            #     # 就是577和518的index都还在unsortedGroup的冒号前 就执行
            # if(unsortedGroup.get(lowGroupIndex) != None and unsortedGroup.get(highGroupIndex) != None):
            #     # 冒号后面的数 就是初始值为1 改成两个相加  第一个的就是 2
            #     unsortedGroup[lowGroupIndex] = unsortedGroup[highGroupIndex] + unsortedGroup[lowGroupIndex]
            #
            #
            #
            # # 2.1.1 low还是白
            # if hashTemp.get(lowIndex)['index'] < 0:
            #             hashTemp.get(lowIndex)['index'] = abs(highGroupIndex)
            #             # del unsortedGroup[lowGroupIndex]
            #             continue
            #         # low 不白  566#518
            #         # else:
            #         #     continue
            #
            # # 2.2 低del了 high还是白
            # if (unsortedGroup.get(lowGroupIndex) == None and unsortedGroup.get(highGroupIndex) != None):
            #         # 2.2.1 high还是白
            #         if hashTemp.get(highIndex)['index'] < 0:
            #             hashTemp.get(highIndex)['index'] = abs(lowGroupIndex)
            #             # del unsortedGroup[highGroupIndex]
            #             continue
            #         # 不白
            #         # else:
            #         #     continue



            '''版本粗'''


            '''
                版本plus
            '''
            # print(lowGroupIndex)
            # print(highGroupIndex)
            # print(len(unsortedGroup))
            # print(99999999999999999999)
            # print(unsortedGroup.get(lowGroupIndex))
            # print(unsortedGroup[lowGroupIndex])
            # print(unsortedGroup.get(highGroupIndex))
            # print(unsortedGroup)
            # 比如577#518  假设577index是29和518index是100 lowGroupIndex就是29
            # highGroupIndex就是100  29和100是unsortedGroup冒号前面那个数 冒号后面数为1
            # status -1说明没人要 1就是有人要了
            # 1 双不del
            if (unsortedGroup.get(lowGroupIndex) != None and unsortedGroup.get(highGroupIndex) != None):
                # # 情况0 二白 留第一个 第二个变第一个 第二个的花括号里面冒号前面的删掉
                # print(999999)
                if(unsortedGroup[lowGroupIndex] <= 1 and unsortedGroup[highGroupIndex] <= 1):
                    # print(1111111)
                    # 冒号后面的数 就是初始值为1 改成两个相加  第一个的就是 2
                    unsortedGroup[lowGroupIndex] = unsortedGroup[highGroupIndex] + unsortedGroup[lowGroupIndex]
                    # del unsortedGroup[highGroupIndex]
                    hashTemp.get(highIndex)['index'] = abs(lowGroupIndex)
                    hashTemp.get(highIndex)['status'] = abs(hashTemp.get(highIndex)['status'])
                    # hashTemp.get(lowIndex)['index'] = abs(lowGroupIndex)
                    hashTemp.get(lowIndex)['status'] = abs(hashTemp.get(lowIndex)['status'])
                    del unsortedGroup[highGroupIndex]
                    continue
                # 情况1  low大哥high白 577#505  577的index变成了29   505的index假设是-66 把505的index改成577的 花括号删505的冒号前
                if (unsortedGroup[lowGroupIndex] > 1 and unsortedGroup[highGroupIndex] <= 1):
                    # print(12121212)
                    unsortedGroup[lowGroupIndex] = unsortedGroup[highGroupIndex] + unsortedGroup[lowGroupIndex]
                    hashTemp.get(highIndex)['index'] = abs(lowGroupIndex)
                    hashTemp.get(highIndex)['status'] = abs(hashTemp.get(highIndex)['status'])
                    del unsortedGroup[highGroupIndex]
                    continue
                #low白 high大哥   566#577 577的index还是29 566的index从88变成了29
                if (unsortedGroup[lowGroupIndex] <= 1 and unsortedGroup[highGroupIndex] > 1):
                    # print(13131313)
                    unsortedGroup[highGroupIndex] = unsortedGroup[highGroupIndex] + unsortedGroup[lowGroupIndex]
                    hashTemp.get(lowIndex)['index'] = abs(highGroupIndex)
                    hashTemp.get(lowIndex)['status'] = abs(hashTemp.get(lowIndex)['status'])
                    del unsortedGroup[lowGroupIndex]
                    continue
                #双大哥
                if (unsortedGroup[lowGroupIndex] > 1 and unsortedGroup[highGroupIndex] > 1):
                    # print(6666666666666)
                    continue

            flag = False
            if flag:
                pass
            # 2一方del了的情况
            # 2.1 .高del了 low还是白  456#518
            if (unsortedGroup.get(highGroupIndex) == None and unsortedGroup.get(lowGroupIndex) != None):
                # 2.1.1 low还是白
                if hashTemp.get(lowIndex)['status'] == -1:
                    # print(2121212121)
                    hashTemp.get(lowIndex)['index'] = abs(highGroupIndex)
                    hashTemp.get(lowIndex)['status'] = abs(hashTemp.get(lowIndex)['status'])
                    del unsortedGroup[lowGroupIndex]
                    continue
                # low 不白  566#518
                else:
                    continue

            # 2.2 低del了 high还是白
            if (unsortedGroup.get(lowGroupIndex) == None and unsortedGroup.get(highGroupIndex) != None):
                # 2.2.1 high还是白
                if hashTemp.get(highIndex)['index'] == -1:
                    # print(222222222)
                    hashTemp.get(highIndex)['status'] = abs(hashTemp.get(highIndex)['status'])
                    hashTemp.get(highIndex)['index'] = abs(lowGroupIndex)
                    del unsortedGroup[highGroupIndex]
                    continue
                # 不白
                else:
                    continue

            # 双del
            if (unsortedGroup.get(lowGroupIndex) == None and unsortedGroup.get(highGroupIndex) == None):
                # print(33333333333)
                continue

            # # ********情况2 high是大哥   398#577  应该变化的是398的index 变为577的
            # if(unsortedGroup.get(highGroupIndex) != None):
            #     if(unsortedGroup[highGroupIndex] > 1):
            #         hashTemp.get(lowIndex)['index'] = abs(highGroupIndex)
            #         continue
            #
            # # **********情况3 双大哥  577#499  在碰面之前 577和499都加入了社区
            # # if (lowGroupIndex > 0 and highGroupIndex > 0)
            #
            # if (unsortedGroup.get(highGroupIndex) != None and unsortedGroup.get(lowGroupIndex) != None):
            #     if (unsortedGroup[highGroupIndex] > 1 and unsortedGroup[lowGroupIndex] > 1):
            #         continue

            # 就是577和518的index都还在unsortedGroup的冒号前 就执行
            # if(unsortedGroup.get(lowGroupIndex) != None and unsortedGroup.get(highGroupIndex) != None):
            #     # 冒号后面的数 就是初始值为1 改成两个相加  第一个的就是 2
            #     unsortedGroup[lowGroupIndex] = unsortedGroup[highGroupIndex] + unsortedGroup[lowGroupIndex]


            # 2一方del了的情况
            # 2.1 .高del了 low还是白
            # if (unsortedGroup.get(highGroupIndex) == None and unsortedGroup.get(lowGroupIndex) != None):
            #     # 2.1.1 low还是白
            #     if hashTemp.get(lowIndex)['index'] < 0:
            #         hashTemp.get(lowIndex)['index'] = abs(highGroupIndex)
            #     # low 不白
            #     # else:
            #     #     continue
            #
            #
            # # 2.2 低del了 high还是白
            # if (unsortedGroup.get(lowGroupIndex) == None and unsortedGroup.get(highGroupIndex) != None):
            #     # 2.2.1 high还是白
            #     if hashTemp.get(highIndex)['index'] < 0:
            #         hashTemp.get(highIndex)['index'] = abs(lowGroupIndex)
            #     # 不白
            #     # else:
            #     #     continue




            # 就是577和518的index都还在unsortedGroup的冒号前 就执行
            # if (unsortedGroup.get(lowGroupIndex) != None and unsortedGroup.get(highGroupIndex) != None):
            #     # 冒号后面的数 就是初始值为1 改成两个相加  第一个的就是 2
            #     unsortedGroup[lowGroupIndex] = unsortedGroup[highGroupIndex] + unsortedGroup[lowGroupIndex]
            #
            # # print(unsortedGroup[lowGroupIndex])
            # # print(88888888888888888)
            # if (unsortedGroup.get(highGroupIndex) != None):
            #     # 就把518的index100包括冒号后面的1都给删了
            #     del unsortedGroup[highGroupIndex]
            #
            # # 把518的index从100变成了29
            # hashTemp.get(highIndex)['index'] =abs(lowGroupIndex)
            # hashTemp.get(lowIndex)['index'] = abs(lowGroupIndex)

            # hashTemp.get(highIndex)['index'] = lowGroupIndex

        # print(len(unsortedGroup))
        # print(int(len(allNodes['nodes']) * mergeRatio))
        # 最开始len(unsortedGroup)等于115  随着del的越来越多 直到只有14个：14个社区 则循环跳出
        # if len(unsortedGroup) <= int(len(allNodes['nodes']) * mergeRatio):
        if len(unsortedGroup) <= 7:
            # print(777777777)
            break

            '''版本plus'''


    # print(allNodes['nodes'])
    # print(hashTemp.get())


        # print(999999999)
        # print(hashTemp.get(lowIndex)['group'])
        # if hashTemp.get(lowIndex)['group'] != hashTemp.get(highIndex)['group']:
        #     if hashTemp.get(lowIndex)['group'] < 0:
        #         hashTemp.get(highIndex)['group'] = hashTemp.get(lowIndex)['group']
        #         continue
        #     elif hashTemp.get(highIndex)['group'] < 0 :
        #         hashTemp.get(lowIndex)['group'] = hashTemp.get(highIndex)['group']
        #         continue
        #
        #     # print(hashTemp.get(lowIndex)['group'])
        #     hashTemp.get(lowIndex)['group'] = numberGroup
        #
        #     hashTemp.get(highIndex)['group'] = hashTemp.get(lowIndex)['group']
        #
            # print(hashTemp.get(lowIndex)['group'])


            #
            #
            # lowGroupIndex = hashTemp.get(lowIndex)['group']
            # # print(lowGroupIndex)
            # highGroupIndex = hashTemp.get(highIndex)['group']
            #
            # # print(999999999)
            # unsortedGroup[lowGroupIndex] = unsortedGroup[highGroupIndex] + unsortedGroup[lowGroupIndex]
            # del unsortedGroup[highGroupIndex]
            #
            # print(999999999)
            # print(hashTemp.get(highIndex))
            # # hashTemp.get(highIndex)
            #
            #
            # for node in allNodes['nodes']:
            #     print(node)


    # print(unsortedGroup.items())
    sortedGroup = sorted(unsortedGroup.items(), key=lambda group: group[1], reverse=True)
    # print(sortedGroup)

    # print(distanceMap)
        # i['source']
    # print(hashTemp.find(167).data)

    # print(hashTemp.find(167))
    # json.loads(hashTemp.find(167))

    # hashTemp.list()
    # print(hashTemp.list())
    # strTemp = str(hashTemp.find(167))
    # strTemp2 = str(strTemp.split(',{')[1])
    # strTemp3 = strTemp2.split('})')
    #
    # print(strTemp3[0])
    # nodeValue = '{' + strTemp3[0] + '}'
    #
    # print(type(nodeValue))
    #
    #
    # json.loads(nodeValue)
    # # print(nodeValue)
    #
    #     # '{'+json.loads(strTemp3[0])
    # print(type(nodeValue))
    # print(nodeValue)
    # print(strTemp.split(',{'))
    # print(hashTemp.find(167))
    # node1 = HashNode(1, 1)
    # node2 = HashNode(2, 2)
    # node3 = HashNode(3, 3)
    # node4 = HashNode(4, 4)
    # node5 = HashNode(5, 5)
    # node6 = HashNode(6, 6)
    # node7 = HashNode(7, 7)
    # node8 = HashNode(8, 8)
    # hash_table = HashTable()
    # hash_table.add(node1)
    # hash_table.add(node2)
    # hash_table.add(node3)
    # hash_table.add(node4)
    # hash_table.add(node5)
    # hash_table.add(node6)
    # hash_table.add(node7)
    # hash_table.add(node8)
    # hash_table.list()
    # node4.data = 666
    # hash_table.update(node4)
    # print("update ==== ")
    # hash_table.list()
    # print('find ====')
    # print(hash_table.find(3))
    # hash_table.delete(node3)
    # hash_table.delete(node4)
    # print("delete ---")
    # hash_table.list()
    # print(node_hash.get(607))
    # print(node_hash.get(node_hash,607))
    # node_hash.add(4,16)
    # print(node_hash)
    # print(node_hash.list())
    # for i in range(tarSouNumber):
    #     for j in range(i+1,tarSouNumber):
    #         # print(str(allNodes['nodes'][i]['id']))
    #         # print(str(allNodes['nodes'][j]['id']))
    #         nodeDistance = (allNodes['nodes'][i]['x']-allNodes['nodes'][j]['x'])*(allNodes['nodes'][i]['x']-allNodes['nodes'][j]['x']) + (allNodes['nodes'][i]['y']-allNodes['nodes'][j]['y'])*(allNodes['nodes'][i]['y']-allNodes['nodes'][j]['y'])
    #         distanceMap[str(allNodes['nodes'][i]['id'])+'#'+str(allNodes['nodes'][j]['id'])]=nodeDistance
    # distanceMap = {}
    # # print(allNodes)
    # for i in range(pointsNumber):
    #     for j in range(i+1,pointsNumber):
    #         # print(str(allNodes['nodes'][i]['id']))
    #         # print(str(allNodes['nodes'][j]['id']))
    #         nodeDistance = (allNodes['nodes'][i]['x']-allNodes['nodes'][j]['x'])*(allNodes['nodes'][i]['x']-allNodes['nodes'][j]['x']) + (allNodes['nodes'][i]['y']-allNodes['nodes'][j]['y'])*(allNodes['nodes'][i]['y']-allNodes['nodes'][j]['y'])
    #         distanceMap[str(allNodes['nodes'][i]['id'])+'#'+str(allNodes['nodes'][j]['id'])]=nodeDistance
    # distanceMap = sorted(distanceMap.items(),key=lambda dist:dist[1],reverse=False)
    # print(distanceMap)
    # print(99999999999999)
    # unsortedGroup =
    # for key,_ in distanceMap:
    #     # print(key)
    #     lowIndex, highIndex = int(key.split('#')[0]), int(key.split('#')[1])


    # print(allNodes['nodes'])
    topClusterCenterCount = 0
    # print (sortedGroup, len(sortedGroup))
    # print(len(sortedGroup))
    # print(sortedGroup)
    # print(points)
    for key, _ in sortedGroup:
        # print(key)
        # print(_)
        # print(9999999)
        topClusterCenterCount += 1
        # for point in allNodes['nodes']:
        #     print(point)
        for point in allNodes['nodes']:
            # print(point)
            if point['index'] == key:
                # point['index'] = topClusterCenterCount
                point['index'] = -1 * topClusterCenterCount
        if topClusterCenterCount >= clusterCenterNumber:
            break

    colorStore = ['or', 'og', 'ob', 'oc', 'om', 'oy', 'ok','^r', '^g', '^b', '^c', '^m', '^y', '^k','+r', '+g', '+b', '+c', '+m', '+y']
    # pylab.figure(figsize=(9, 9), dpi=80)
    plt.figure(figsize=(9, 9), dpi=80)

    # pylab.invert()

    for point in allNodes['nodes']:
        print(point['index'])
        if point['index'] < 0:
            color = colorStore[-1 * point['index'] - 1]
        else:
            color = '+k'
        plt.plot(point['x'],point['y'],color)
        # plt.plot(point.x, point.y, color)

    # 坐标原点移动到左上角
    ax = plt.gca()
    ax.xaxis.set_ticks_position('top')
    ax.invert_yaxis()

    plt.show()

    print(allNodes)

    return jsonify(layoutNodesInformation)


class KeyValue:

    def __init__(self, key: int, value: Any) -> None:
        self.key: int = key
        self.value: Any = value



class HashTable:

    def __init__(self, capacity: int = 11) -> None:
        self.capacity: int = capacity
        self.length: int = 0
        self.table: List[List[KeyValue]] = [None] * self.capacity

    def put(self, key: int, value: Any) -> int:
        index: int = self.hash(key)
        if self.table[index] is None:
            self.table[index] = [KeyValue(key, value)]
            self.length += 1
        else:
            found: bool = False
            i: int = 0
            items: List[KeyValue] = self.table[index]
            while i < len(items) and not found:
                if items[i].key == key:
                    found = True
                else:
                    i += 1
            if found:
                items[i].value = value
            else:
                items.append(KeyValue(key, value))
                self.length += 1

    def get(self, key: int) -> Any:
        index: int = self.hash(key)
        if self.table[index] is None:
            return None
        else:
            found: bool = False
            i: int = 0
            items: List[KeyValue] = self.table[index]
            while i < len(items) and not found:
                if items[i].key == key:
                    found = True
                else:
                    i += 1
            if found:
                return items[i].value
            else:
                return None

    def contains(self, key: int) -> bool:
        index: int = self.hash(key)
        if self.table[index] is None:
            return False
        else:
            found: bool = False
            i: int = 0
            items: List[KeyValue] = self.table[index]
            while i < len(items) and not found:
                if items[i].key == key:
                    found = True
                else:
                    i += 1
            if found:
                return True
            else:
                return False

    def delete(self, key: int) -> None:
        index: int = self.hash(key)
        if self.table[index] is None:
            return None
        else:
            found: bool = False
            i: int = 0
            items: List[KeyValue] = self.table[index]
            while i < len(items) and not found:
                if items[i].key == key:
                    found = True
                else:
                    i += 1
            if found:
                items.pop(i)
            return None

    def hash(self, key: int) -> int:
        return key % self.capacity

    def size(self) -> int:
        return self.length


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0')
