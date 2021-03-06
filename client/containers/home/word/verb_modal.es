import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { getURLSafeWord } from './utils.es';

import Modal from '../../../components/modal';

const LABELS = [
  'ich',
  'du',
  'er/sie/es',
  'wir',
  'ihr',
  'sie/Sie',
];

const renderForms = (data) => {
  if (!data.forms) return null;

  const renderRow = (label, index) => (
    <tr key={label}>
      <td className="VerbModal-Label">{label}</td>
      <td>{data.forms.section_0[index]}</td>
      <td>{data.forms.section_1[index]}</td>
      <td>{data.forms.section_2[index]}</td>
    </tr>
  );

  return (
    <table className="VerbModal-Table">
      <tbody>
        <tr>
          <th />
          <th>Indikativ Präsens</th>
          <th>Indikativ Präteritum</th>
          <th>Indikativ Perfekt</th>
        </tr>
        {LABELS.map(renderRow)}
      </tbody>
    </table>
  );
};

const VerbModal = (props) => {
  const className = classNames('VerbModal', props.className);
  const { item, ...cleanProps } = props;
  const { word, translation } = item.data;

  const urlSafeWord = getURLSafeWord(word, item.type);
  const formsLink = `http://en.bab.la/conjugation/german/${urlSafeWord}`;
  const wikiLink = `https://en.wiktionary.org/wiki/${urlSafeWord}`;
  const googleLink = `https://translate.google.com/#de/en/${urlSafeWord}`;

  return (
    <Modal {...cleanProps} className={className}>
      <header>
        <span className="VerbModal-Word">{word}</span>
        &mdash;
        <strong className="VerbModal-Translation">{translation}</strong>
      </header>

      {renderForms(item.data)}

      <footer className="VerbModal-Links">
        more on
        <a href={wikiLink} rel="noopener noreferrer nofollow" target="_blank">wiktionary.org</a>
        or
        <a href={formsLink} rel="noopener noreferrer nofollow" target="_blank">bab.la</a>
        or
        <a href={googleLink} rel="noopener noreferrer nofollow" target="_blank">translate.google.com</a>
      </footer>
    </Modal>
  );
};

VerbModal.propTypes = {
  className: PropTypes.string,
  item: PropTypes.object,
  onClose: PropTypes.func,
};

export default VerbModal;
