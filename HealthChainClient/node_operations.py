import os
import json


def get_all_nodes(location="records"):
    return [os.path.join(location, file) for file in os.listdir(location)]


def parse_node(loc: str, desired_node_type="patient_data"):
    with open(loc) as f:
        node_contents = json.load(f)

    node_type = node_contents.get("node_type")
    if not node_type:
        return None

    if node_type == "patient_data" and desired_node_type == "patient_data":
        encrypted_data = node_contents.get("encrypted_data")
        metadata = node_contents.get("metadata")
        return encrypted_data, metadata
