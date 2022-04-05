import * as React from 'react';
import styles from './VotacaoCipaAuditoria.module.scss';
import { IVotacaoCipaAuditoriaProps } from './IVotacaoCipaAuditoriaProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class VotacaoCipaAuditoria extends React.Component<IVotacaoCipaAuditoriaProps, {}> {
  public render(): React.ReactElement<IVotacaoCipaAuditoriaProps> {
    return (
      <div className={ styles.votacaoCipaAuditoria }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
