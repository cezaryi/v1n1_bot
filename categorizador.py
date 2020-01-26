import pandas as pd
import requests
import os


def categorizar_TI():
    df = pd.read_csv("C:/Users/Chicao/Documents/licitações/test.csv", sep=';', encoding='latin-1')
    print(df.Objeto)
    ver = df.Objeto.str.contains('sistemas informatizados|software|informatica|computadores|computador|locação de sistema|suporte tecnico|impressora'
                                 , case=False, regex=True, na=False)
    print(df[ver])
    final = (df[ver])
    final.to_csv('./licitacao_TI.csv', sep=';', index=False, encoding='latin-1')

    df = pd.read_csv("./licitacao_TI.csv", sep=';', encoding='latin-1')
    ver_TI_software = df.Objeto.str.contains('sistemas informatizados|software|locação de sistema', case=False, regex=True, na=False)
    final = (df[ver_TI_software])
    final.to_csv('./licitacao_TI_software.csv', sep=';', index=False, encoding='latin-1')

    df = pd.read_csv("./licitacao_TI.csv", sep=';', encoding='latin-1')
    ver_TI_suporte = df.Objeto.str.contains('informatica|computadores|computador|suporte tecnico|impressora', case=False,
                                             regex=True, na=False)
    final = (df[ver_TI_suporte])
    final.to_csv('./licitacao_TI_suporte.csv', sep=';', index=False, encoding='latin-1')

def filtroCnae():
    df = pd.read_csv("./cnaes.csv", sep=';', encoding='latin-1')
    print(df.Descrição)
    ver = df.Descrição.str.contains('computador|programas de computador|suporte técnico|tecnologia da informação|equipamentos de informática|suprimentos de informática|treinamento em informática'
        , case=False, regex=True, na=False)
    print(df[ver])
    final = (df[ver])
    final.to_csv('./cnaes_TI.csv', sep=';', index=False, encoding='latin-1')

def filtraLicitacao():
    chave = []
    chave.append('fabricação|equipamento|equipamentos|informática')
    chave.append('fabricação|periféricos|equipamentos|informática')
    chave.append('aquisição|computadores|suprimentos de informática|equipamentos de informática')
    chave.append('serviço técnico|recarga|tonner|cartucho|impressora|informática')
    chave.append('Desenvolvimento de sistemas|sistemas informatizados|software|programa de computador')
    chave.append('Desenvolvimento de sistemas|sistemas informatizados|software|programa de computador|licença de sistema')
    chave.append('Consultoria em tecnologia da informação|consultoria de sistema')
    chave.append('suporte técnico|manutenção de computadores|manutenção de sistemas|serviços de informática')
    chave.append('treinamento em informática|treinamento de programadores|treinamento de software')
    cnae = []
    cnae.append('2621-3/00 ')
    cnae.append('2622-1/00 ')
    cnae.append('01/06/4651 ')
    cnae.append('02/02/4751 ')
    cnae.append('6201-5/00 ')
    cnae.append('6202-3/00 6203-1/00 ')
    cnae.append('6204-0/00 ')
    cnae.append('6209-1/00 ')
    cnae.append('03/06/8599 ')

    df = pd.read_csv("./licitacao_TI.csv", sep=';', encoding='latin-1')
    df['Cnaes'] = [''] * len(df.Objeto)
    i=0
    for y in chave:
        df['check'] = df.Objeto.str.contains(y, case=False, regex=True, na=False)
        df['Cnaes'] = df['Cnaes'] + df.check.map({True: cnae[i], False: ''})
        i = i + 1
    del df['check']
    print(df)

    df.to_json('./licitações_cnaes.json', force_ascii=False)
    df.to_csv('./licitacao_cnaes.csv', sep=';', index=False, encoding='latin-1')


def comparaCnae():
    df = pd.read_csv("./arquivoluis.csv", sep=';', encoding='latin-1')
    cnaes = pd.read_csv("./licitacao_cnaes.csv", sep=';', encoding='latin-1')
    codigo = []
    i = 0
    j = 0
    for i in df.CPF/CNPJ:
        r = requests.get('https://receitaws.com.br/v1/cnpj/' + str(i)).json()
        for each in r['atividade_principal']:
            codigo.append(each['code'])
            i = i + 1
        for each in r['atividades_secundarias']:
            codigo.append(each['code'])
            i = i + 1
        j = i
        i = 0
        for x in cnaes.Cnaes:
                for b in codigos:
                    if  b in x:
                        caso ok
                        break
            else:
            discrepância

filtraLicitacao()

comparaCnae()

