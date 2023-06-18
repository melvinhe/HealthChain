import json
import pandas as pd
import datetime
from os import listdir
from os.path import isfile, join
import re


def process_dem_data(raw_data):
    el1 = raw_data['resource']

    pid = el1['id']
    extension = el1['extension']
    name = el1['name']
    telecom = el1['telecom']

    # store this
    race = ''
    ethnicity = ''
    birthplace = ''
    disability_adjusted_life_years = ''
    quality_adjusted_life_years = ''
    for d in extension:
        if "us-core-race" in d['url']:
            race = d['extension'][-1]['valueString']
        if "us-core-ethnicity" in d['url']:
            ethnicity = d['extension'][-1]['valueString']
        if "patient-birthPlace" in d['url']:
            birthplace = d['valueAddress']
        if "disability-adjusted-life-years" in d['url']:
            disability_adjusted_life_years = d['valueDecimal']
        if "quality-adjusted-life-years" in d['url']:
            quality_adjusted_life_years = d['valueDecimal']

    firstname = ''
    lastname = ''
    for d in name:
        if "official" in d['use']:
            lastname = d['family']
            firstname = d['given'][0]
            lastname = re.sub(r'\d+', '', lastname)
            firstname = re.sub(r'\d+', '', firstname)

    phone = ''
    for d in telecom:
        if 'phone' in d['system']:
            phone = d['value']

    gender = el1['gender']
    birthdate = el1['birthDate']
    line = el1['address'][0]['line'][0]
    city = el1['address'][0]['city']
    state = el1['address'][0]['state']
    #             postalcode = el1['address'][0]['postalCode']
    country = el1['address'][0]['country']
    address = ', '.join([line, city, state])
    demographics = {'patient_id': pid,
                    'first_name': firstname,
                    'last_name': lastname,
                    'gender': gender,
                    'birthdate': birthdate,
                    'phone': phone,
                    'address': address,
                    'race': race,
                    'ethnicity': ethnicity,
                    #                     'birthplace':birthplace,
                    }
    return demographics


def clean_fhir_data(fhir_json):
    data1 = fhir_json['entry']
    metadata = {}
    phi = {}
    conditions_l = []
    for el in data1:
        resource_type = el['resource']['resourceType']
        if resource_type == 'Condition':
            conditions_l.append(el['resource']['code']['text'])
        if resource_type == 'Patient':
            phi.update(process_dem_data(el))

    metadata['conditions'] = list(set(conditions_l))
    return metadata, phi
