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
    cnae.append('26.21-3-00 ')
    cnae.append('26.22-1-00 ')
    cnae.append('46.51-6-01 ')
    cnae.append('47.51-2-01 ')
    cnae.append('62.01-5-00 ')
    cnae.append('2.03-1-00 ')
    cnae.append('2.04-0-00 ')
    cnae.append('62.09-1-00 ')
    cnae.append('85.99-6-03 ')

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
        codigos = ''
        for x in codigo:
            codigos = codigos + x + '|'
        #codigos = codigos[:-1] #lista de cnaes do cnpj
        tamanhocodigo = len(codigo)
        linha = df.loc[df['CPF/CNPJ'] == str(i)]
        todoscnaes = linha.Cnaes
        linhacnaes = todoscnaes.split(' ') # lista de cnaes da licitação
        for each in linhacnaes:
            if each in codigo:
                list.remove(each)
        if len(codigo) == tamanhocodigo:
            #Cnae Incompatível

        else if len(codigo)> 3:
            #Cnaes Genéricos
        else:
            #tá ok





filtraLicitacao()

comparaCnae()

