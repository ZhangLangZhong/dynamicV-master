# coding=utf-8
import networkx as nx


def cal_degree(m_graph):
    """ 计算度 0x001"""
    return m_graph.degree()


def cal_clustering(m_graph):
    """ 计算聚类系数  根据源码，这里的的参数接收的图必须是undirected,不然就会报错 0x005"""
    return nx.clustering(m_graph.to_undirected(), nx.nodes(m_graph))


def cal_degree_centrality(m_graph):
    """ 计算度中心性 0x006"""
    return nx.degree_centrality(m_graph)


def cal_betweness_centrality(m_graph):
    """ 计算介数中心性0x007"""
    return nx.betweenness_centrality(m_graph, None, True)


def cal_closeness_centrality(m_graph):
    """ 计算接近度中心性0x008"""
    return nx.closeness_centrality(m_graph)


def cal_eigenvector_centrality(m_graph):
    """ 计算特征向量中心性0x009"""
    return nx.eigenvector_centrality_numpy(m_graph)


def my_round(f):
    """保留三位并且科学计数表示"""
    round_result = '{0:.2e}'.format(f)
    if round_result == '{0:.2e}'.format(0):
        round_result = 0
    return round_result


def cal_characters_arguments(result):
    """计算传入的result的特征参数"""
    graph = nx.DiGraph()
    # print graph
    # 创建图
    for link in result['links']:
        graph.add_edge(link['source'], link['target'])

    # 开始计算特征参数并且将结果保存到各个list
    degree_list = cal_degree(graph)
    degree_centrality_list = cal_degree_centrality(graph)
    closeness_list = cal_closeness_centrality(graph)
    betweness_list = cal_betweness_centrality(graph)
    eigenvector_list = cal_eigenvector_centrality(graph)
    clustering_list = cal_clustering(graph)
    for node in result['nodes']:
        node_id = node['id']
        node['degree'] = str(degree_list[node_id])
        # print node['degree']
        # 单位为个位的度数
        node['degree_centrality'] = str(my_round(degree_centrality_list[node_id]))
        # print node['degree_centrality']
        # 1.52e-02
        node['closeness_centrality'] = str(my_round(closeness_list[node_id]))
        node['betweness_centrality'] = str(my_round(betweness_list[node_id]))
        node['eigenvector_centrality'] = str(my_round(eigenvector_list[node_id]))
        node['clustering'] = str(my_round(clustering_list[node_id]))
        # print node['clustering']
        #  0
