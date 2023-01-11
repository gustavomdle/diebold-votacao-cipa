import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'VotacaoCipaVotarFabricaWebPartStrings';
import VotacaoCipaVotarFabrica from './components/VotacaoCipaVotarFabrica';
import { IVotacaoCipaVotarFabricaProps } from './components/IVotacaoCipaVotarFabricaProps';

export interface IVotacaoCipaVotarFabricaWebPartProps {
  description: string;
  listId: string;
}

export default class VotacaoCipaVotarFabricaWebPart extends BaseClientSideWebPart<IVotacaoCipaVotarFabricaWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IVotacaoCipaVotarFabricaProps> = React.createElement(
      VotacaoCipaVotarFabrica,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.web.absoluteUrl,
        context: this.context,
        listId: this.properties.listId, 
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
