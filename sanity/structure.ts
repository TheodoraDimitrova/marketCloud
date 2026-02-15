import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Admin access')
        .child(
          S.document()
            .schemaType('adminAccess')
            .documentId('adminAccess')
        ),
      ...S.documentTypeListItems().filter((item) => item.getId() !== 'adminAccess'),
    ])
