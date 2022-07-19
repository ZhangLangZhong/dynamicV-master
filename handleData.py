import os
import random
import pandas as pd
import json

csv_file_path = "files/csvFormat/"
csv_package_file_path = csv_file_path + 'packages/'


def read_file(name, path):
    file_data = pd.read_csv(path + name)
    json_data = file_data.to_json(orient='records')
    data = json.loads(json_data)
    edges_list = []
    for item in data:
        if item['source'] == item['target']:
            continue
        if item not in edges_list:
            edges_list.append(item)
    source = []
    target = []
    for j in edges_list:
        source.append(j['source'])
        target.append(j['target'])
    csv_data = pd.DataFrame({'source': source, 'target': target})
    csv_data.to_csv(path + name, index=False, sep=',')


def package_csv():
    files = os.listdir(csv_package_file_path)
    for f in files:
        read_file(f, csv_package_file_path)


def csv_to_json(csv_file, json_file):
    file_data = pd.read_csv(csv_file)
    json_data = file_data.to_json(orient='records')
    data = json.loads(json_data)
    json_edges = []
    for item in data:
        json_edges.append(item)
    json_nodes = []
    for index, name in enumerate(json_edges):
        name['continuous'] = str(index + 1)
        name['source'] = str(name['source'])
        name['target'] = str(name['target'])
        name['id'] = str(index + 1)
        name['color'] = str('#808080')
        name['weight'] = str(float(random.randint(10, 30) * 1.0 / 10))
        name['opacity'] = str(float(random.randint(40, 90) * 1.0 / 100))
        name['discrete'] = str(random.randint(1, 100))
        if {'id': name['source']} not in json_nodes:
            json_nodes.append({'id': name['source']})
        if {'id': name['target']} not in json_nodes:
            json_nodes.append({'id': name['target']})
    for index, name in enumerate(json_nodes):
        name['continuous'] = str(index + 1)
        name['id'] = str(name['id'])
        name['color'] = str('#C4C9CF')
        name['stroke'] = str('#FFFAF0')
        name['opacity'] = str(float(random.randint(40, 90) * 1.0 / 100))
        name['size'] = str(float(random.randint(20, 100) * 1.0 / 10))
        name['port'] = str(random.randint(10, 65536))
        name['level'] = str(random.randint(1, 7))
        name['discrete'] = str(random.randint(1, 100))

    with open(json_file, 'w') as out_file:
        json.dump({'nodes': json_nodes, 'links': json_edges}, out_file, ensure_ascii=False)


def get_all_edges_packages():
    files = os.listdir(csv_package_file_path)
    all_edges_id = []
    for index, f in enumerate(files):
        file_data = pd.read_csv(csv_package_file_path + f)
        json_data = file_data.to_json(orient='records')
        data = json.loads(json_data)
        for item in data:
            if item not in all_edges_id:
                all_edges_id.append(item)
        print(index)
    source = []
    target = []
    for j in all_edges_id:
        source.append(j['source'])
        target.append(j['target'])
    csv_data = pd.DataFrame({'source': source, 'target': target})
    csv_data.to_csv('files/set_all_packages.csv', index=False, sep=',')
    packages_csv_to_json()


def packages_csv_to_json():
    all_edges = pd.read_csv('files/set_all_packages.csv')
    json_data = all_edges.to_json(orient='records')
    data = json.loads(json_data)
    all_edges_id = []
    for item in data:
        all_edges_id.append(item)
    files = os.listdir(csv_package_file_path)
    for f in files:
        json_edges = []
        json_nodes = []
        file_data = pd.read_csv(csv_package_file_path + f)
        json_data = file_data.to_json(orient='records')
        data = json.loads(json_data)
        for item in data:
            json_edges.append(item)
        for index, name in enumerate(json_edges):
            name['id'] = get_edge_index(all_edges_id, name['source'], name['target'])
            name['continuous'] = str(index + 1)
            name['source'] = str(name['source'])
            name['target'] = str(name['target'])
            name['color'] = str('#808080')
            name['weight'] = str(float(random.randint(10, 30) * 1.0 / 10))
            name['opacity'] = str(float(random.randint(40, 90) * 1.0 / 100))
            name['discrete'] = str(random.randint(1, 100))
            if {'id': name['source']} not in json_nodes:
                json_nodes.append({'id': name['source']})
            if {'id': name['target']} not in json_nodes:
                json_nodes.append({'id': name['target']})
        for index, name in enumerate(json_nodes):
            name['continuous'] = str(index + 1)
            name['id'] = str(name['id'])
            name['color'] = str('#C4C9CF')
            name['stroke'] = str('#FFFAF0')
            name['opacity'] = str(float(random.randint(40, 90) * 1.0 / 100))
            name['size'] = str(float(random.randint(20, 100) * 1.0 / 10))
            name['port'] = str(random.randint(10, 65536))
            name['level'] = str(random.randint(1, 7))
            name['discrete'] = str(random.randint(1, 100))
        with open('files/jsonFormat/packages/' + f.replace('.csv', '.json'), 'w') as out_file:
            json.dump({'nodes': json_nodes, 'links': json_edges}, out_file, ensure_ascii=False)
        print(f)


def get_edge_index(all_edges_list, source, target):
    for index, item in enumerate(all_edges_list):
        if item['source'] == source and item['target'] == target:
            return str(index + 1)


# get_all_edges_packages()
# read_file('small-443nodes-476edges.csv',csv_file_path)
# read_file('middle-1204nodes-2492edges.csv',csv_file_path)
# read_file('large-2992nodes-9697edges.csv',csv_file_path)
# read_file('supper-large-4039nodes-88234edges.csv',csv_file_path)
# package_csv()
# csv_to_json('files/csvFormat/small-443nodes-476edges.csv', 'files/jsonFormat/small-443nodes-476edges.json')
# csv_to_json('files/csvFormat/middle-1204nodes-2492edges.csv', 'files/jsonFormat/middle-1204nodes-2492edges.json')
# csv_to_json('files/csvFormat/large-2992nodes-9696edges.csv', 'files/jsonFormat/large-2992nodes-9696edges.json')


get_all_edges_packages()