import React from 'react';

export interface DropdownRelationEditorProps<Relation extends string, Context> {
    relation: Relation;
    context: Context;
    onChange: (relation: Relation) => void;
}

export function thusDropdownRelationEditor<Relation extends string, Context>(relationsOf: (context: Context) => Relation[]) {
    return class DropdownRelationEditor extends React.Component<DropdownRelationEditorProps<Relation, Context>> {
        render() {
            const { relation, context, onChange } = this.props;
            const relations = relationsOf(context);
            return <select value={relation} onChange={e => {
                const relation = e.currentTarget.value as Relation;
                onChange(relation);
            }}>{relations.map(knownRelation => {
                return <option key={knownRelation} value={knownRelation}>{knownRelation}</option>;
            })}</select>;
        }
    };
}
