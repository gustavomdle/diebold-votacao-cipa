import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'VotacaoCipaAuditoriaWebPartStrings';
import VotacaoCipaAuditoria from './components/VotacaoCipaAuditoria';
import { IVotacaoCipaAuditoriaProps } from './components/IVotacaoCipaAuditoriaProps';

export interface IVotacaoCipaAuditoriaWebPartProps {
  description: string;
}

export default class VotacaoCipaAuditoriaWebPart extends BaseClientSideWebPart<IVotacaoCipaAuditoriaWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IVotacaoCipaAuditoriaProps> = React.createElement(
      VotacaoCipaAuditoria,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.web.absoluteUrl,
        context: this.context,
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
